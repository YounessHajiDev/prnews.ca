import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db/prisma';

export async function POST() {
  try {
    const customer = await stripe.customers.create({
      email: 'demo@prnews.ca',
      metadata: {
        userId: 'user_demo',
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: 'price_growth_monthly' }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    return Response.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
    });
  } catch (error) {
    return Response.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}
