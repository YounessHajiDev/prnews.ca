import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = await getClientIp();
  const limit = await rateLimit('billing-portal', `${ip}:${session.user.id}`, 10, 60 * 1000);
  if (!limit.success) {
    return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  if (!stripe) {
    return Response.json(
      { error: 'Stripe is not configured' },
      { status: 503 }
    );
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });

  const subscription = user?.subscriptions[0];

  if (!subscription?.stripeCustomerId) {
    return Response.json({ error: 'No Stripe customer found' }, { status: 404 });
  }

  try {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/billing`,
    });

    return Response.json({ url: stripeSession.url });
  } catch (error: any) {
    console.error('Stripe portal error:', error);
    return Response.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}
