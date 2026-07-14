import Stripe from 'stripe';

let stripe: Stripe | undefined;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    typescript: true,
  });
}

export { stripe };
