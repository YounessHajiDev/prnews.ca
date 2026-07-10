import { auth } from '@/lib/auth/auth';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export const POST = async (request: Request) => {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  switch (event.type) {
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as any;
      // Update subscription status
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as any;
      // Handle subscription updates
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response('OK');
};
