import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

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

    const latestInvoice = subscription.latest_invoice as Stripe.Invoice | null;
    const paymentIntent = latestInvoice?.payment_intent as Stripe.PaymentIntent | null;

    return Response.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret,
    });
  } catch (error) {
    return Response.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}
