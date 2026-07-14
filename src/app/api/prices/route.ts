import { stripe } from '@/lib/stripe';

export async function GET() {
  if (!stripe) {
    return Response.json(
      { error: 'Stripe is not configured' },
      { status: 503 }
    );
  }

  try {
    const products = await stripe.products.list();
    const prices = await stripe.prices.list();
    return Response.json({ products, prices });
  } catch {
    return Response.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
