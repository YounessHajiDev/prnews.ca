import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db/prisma';
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export async function POST() {
  const session = await auth();
  if (!session) redirect('/login');

  try {
    const customer = await stripe.customers.list({
      email: session.user.email ?? undefined,
      limit: 1,
    });

    if (customer.data.length === 0) {
      return Response.json({ error: 'No Stripe customer found' }, { status: 404 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.data[0].id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/billing`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}
