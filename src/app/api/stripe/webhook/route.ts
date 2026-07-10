import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      console.log('Checkout session completed:', session.id);
      break;
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as any;
      console.log('Invoice payment succeeded:', invoice.id);
      break;
    }
    case 'customer.subscription.created': {
      const subscription = event.data.object as any;
      console.log('Subscription created:', subscription.id);
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any;
      console.log('Subscription deleted:', subscription.id);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response('OK');
}
