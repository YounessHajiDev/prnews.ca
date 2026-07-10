import { stripe } from '@/lib/stripe';

export async function GET() {
  try {
    const products = await stripe.products.list();
    const prices = await stripe.prices.list();
    return Response.json({ products, prices });
  } catch {
    return Response.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
