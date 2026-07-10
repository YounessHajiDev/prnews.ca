import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db/prisma';

const PLANS = {
  starter: {
    id: 'price_starter_monthly',
    name: 'Starter',
    price: 29900,
    credits: 1,
  },
  growth: {
    id: 'price_growth_monthly',
    name: 'Growth',
    price: 19900,
    credits: 4,
  },
};

export async function GET() {
  try {
    const products = await stripe.products.list({
      expand: ['data.default_price'],
    });

    const prices = await stripe.prices.list({
      expand: ['data.product'],
    });

    return Response.json({ products, prices });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { priceId, quantity = 1 } = body;

  if (!priceId) {
    return Response.json({ error: 'Price ID is required' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      metadata: {
        userId: body.userId,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
