import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { verifyOrigin } from '@/lib/csrf';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CheckoutSchema = z.object({
  priceId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(100).default(1),
});

const PRICE_TO_PLAN: Record<string, string> = {
  price_starter_monthly: 'starter',
  price_growth_monthly: 'growth',
};

const PLAN_MODES: Record<string, 'payment' | 'subscription'> = {
  starter: 'payment',
  growth: 'subscription',
};

export async function GET() {
  if (!stripe) {
    return Response.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  try {
    const products = await stripe.products.list({ expand: ['data.default_price'] });
    const prices = await stripe.prices.list({ expand: ['data.product'] });
    return Response.json({ products, prices });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!stripe) {
    return Response.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  if (!verifyOrigin(request)) {
    return Response.json({ error: 'Invalid origin' }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = getClientIp();
  const limit = await rateLimit('stripe-checkout', `${ip}:${session.user.id}`, 10, 60 * 1000);
  if (!limit.success) {
    return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  let raw: any;
  const contentType = request.headers.get('content-type') || '';
  try {
    if (contentType.includes('application/json')) {
      raw = await request.json();
    } else {
      const formData = await request.formData();
      raw = Object.fromEntries(formData.entries());
    }
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = CheckoutSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues.map((i) => i.message).join('. ') }, { status: 400 });
  }

  const { priceId, quantity } = parsed.data;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  let customerId = user.subscriptions[0]?.stripeCustomerId;
  const plan = PRICE_TO_PLAN[priceId] ?? 'starter';

  try {
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: PLAN_MODES[plan] ?? 'subscription',
      line_items: [{ price: priceId, quantity }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      metadata: { userId: user.id, plan },
    });

    if (!checkoutSession.url) {
      return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }

    if (contentType.includes('application/json')) {
      return Response.json({ url: checkoutSession.url });
    }
    return NextResponse.redirect(checkoutSession.url);
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
