import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { verifyOrigin } from '@/lib/csrf';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const PRICES: Record<string, string> = {
  starter: 'price_starter_monthly',
  growth: 'price_growth_monthly',
};

const PLAN_MODES: Record<string, 'payment' | 'subscription'> = {
  starter: 'payment',
  growth: 'subscription',
};

const TIER_BY_PLAN: Record<string, 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'> = {
  starter: 'STARTER',
  growth: 'PROFESSIONAL',
  agency: 'ENTERPRISE',
  enterprise: 'ENTERPRISE',
};

export async function GET(request: Request) {
  if (!stripe) {
    return Response.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  if (!(await verifyOrigin(request))) {
    return Response.json({ error: 'Invalid origin' }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user?.email) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const { searchParams } = new URL(request.url);
  const planId = searchParams.get('plan') ?? '';

  const parsed = z.string().min(1).safeParse(planId);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const priceId = PRICES[planId];
  if (!priceId) {
    return Response.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const ip = await getClientIp();
  const limit = await rateLimit('stripe-subscribe', `${ip}:${session.user.id}`, 10, 60 * 1000);
  if (!limit.success) {
    return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  let customerId = user.subscriptions[0]?.stripeCustomerId;

  try {
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
    }

    const mode = PLAN_MODES[planId] ?? 'subscription';

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      metadata: { userId: user.id, plan: planId, tier: TIER_BY_PLAN[planId] },
    });

    if (!checkoutSession.url) {
      return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }

    return NextResponse.redirect(checkoutSession.url);
  } catch (error: any) {
    console.error('Stripe subscribe error:', error);
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
