import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!stripe) {
    return Response.json(
      { error: 'Stripe is not configured' },
      { status: 503 }
    );
  }

  try {
    const customer = await stripe.customers.list({
      email: session.user.email ?? undefined,
      limit: 1,
    });

    if (customer.data.length === 0) {
      return Response.json({ error: 'No Stripe customer found' }, { status: 404 });
    }

    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: customer.data[0].id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/billing`,
    });

    return Response.json({ url: stripeSession.url });
  } catch (error) {
    return Response.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}
