import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const planId = searchParams.get('plan');

  const PRICES: Record<string, string> = {
    starter: 'price_starter_monthly',
    growth: 'price_growth_monthly',
  };

  const priceId = PRICES[planId ?? ''];

  if (!priceId) {
    return Response.json({ error: 'Invalid plan' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      metadata: {
        plan: planId,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
