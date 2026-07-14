import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import type Stripe from 'stripe';

const TIER_BY_PLAN: Record<string, 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'> = {
  starter: 'STARTER',
  growth: 'PROFESSIONAL',
  agency: 'ENTERPRISE',
  enterprise: 'ENTERPRISE',
};

const CREDITS_BY_TIER: Record<string, number> = {
  STARTER: 1,
  PROFESSIONAL: 4,
  ENTERPRISE: 10,
};

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

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
  }

  // Idempotency: skip if already processed
  const existing = await db.processedStripeEvent.findUnique({
    where: { eventId: event.id },
  });
  if (existing) {
    return new Response('Already processed');
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId) {
          console.warn('Checkout session completed without userId:', session.id);
          break;
        }

        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

        if (session.mode === 'subscription') {
          // Fetch subscription details to get current_period_end and status
          const subscription = subscriptionId
            ? await stripe.subscriptions.retrieve(subscriptionId)
            : null;

          const plan = session.metadata?.plan as string | undefined;
          const tier = TIER_BY_PLAN[plan ?? ''] ?? 'PROFESSIONAL';

          await db.$transaction(async (tx) => {
            await tx.subscription.upsert({
              where: { stripeCustomerId: customerId ?? '' },
              create: {
                userId,
                stripeCustomerId: customerId ?? '',
                stripeSubscriptionId: subscriptionId,
                tier,
                status: subscription?.status ?? 'active',
                currentPeriodEnd: subscription?.current_period_end
                  ? new Date(subscription.current_period_end * 1000)
                  : null,
              },
              update: {
                stripeSubscriptionId: subscriptionId,
                tier,
                status: subscription?.status ?? 'active',
                currentPeriodEnd: subscription?.current_period_end
                  ? new Date(subscription.current_period_end * 1000)
                  : null,
              },
            });
          });
        } else if (session.mode === 'payment') {
          // One-time purchase (e.g. Starter); credit the user immediately
          const plan = session.metadata?.plan as string | undefined;
          const tier = TIER_BY_PLAN[plan ?? ''] ?? 'STARTER';
          const credits = CREDITS_BY_TIER[tier] ?? 1;

          await db.$transaction(async (tx) => {
            await tx.creditTransaction.create({
              data: {
                userId,
                amount: credits,
                type: 'purchase',
                stripeRef: session.id,
              },
            });

            await tx.subscription.upsert({
              where: { stripeCustomerId: customerId ?? '' },
              create: {
                userId,
                stripeCustomerId: customerId ?? '',
                tier: 'STARTER',
                status: 'active',
              },
              update: {
                tier: 'STARTER',
                status: 'active',
              },
            });
          });
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
        const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;

        if (!customerId || !subscriptionId) break;

        const subscription = await db.subscription.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (subscription) {
          const credits = CREDITS_BY_TIER[subscription.tier] ?? 1;
          await db.$transaction(async (tx) => {
            await tx.creditTransaction.create({
              data: {
                userId: subscription.userId,
                amount: credits,
                type: 'purchase',
                stripeRef: invoice.id,
              },
            });

            await tx.subscription.update({
              where: { stripeCustomerId: customerId },
              data: { status: 'active' },
            });
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;

        if (!customerId) break;

        await db.subscription.update({
          where: { stripeCustomerId: customerId },
          data: {
            status: subscription.status,
            currentPeriodEnd: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : null,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;

        if (!customerId) break;

        await db.subscription.update({
          where: { stripeCustomerId: customerId },
          data: { status: 'canceled', cancelAtPeriodEnd: false },
        });
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    await db.processedStripeEvent.create({
      data: { eventId: event.id, type: event.type },
    });

    revalidatePath('/app/billing');
  } catch (err: any) {
    console.error('Stripe webhook processing error:', err);
    // Return 500 so Stripe retries
    return new Response(`Webhook processing error: ${err.message}`, { status: 500 });
  }

  return new Response('OK');
}
