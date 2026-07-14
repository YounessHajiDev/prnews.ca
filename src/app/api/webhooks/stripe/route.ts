import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  if (!stripe) {
    return new Response('Stripe is not configured', { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response('Stripe webhook secret is not configured', { status: 503 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      console.log('Checkout completed:', session.id);
      break;
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as any;
      console.log('Payment succeeded:', invoice.id);
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as any;
      console.log('Subscription updated:', subscription.id);
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any;
      console.log('Subscription deleted:', subscription.id);
      break;
    }
    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  return new Response('OK');
}
