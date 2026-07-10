import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db/prisma';
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter',
    price: 'CAD $299',
    description: 'Perfect for one-off announcements',
    features: ['1 release', 'National distribution', '1 category', 'Basic analytics'],
    priceId: 'price_starter_monthly',
  },
  {
    name: 'Growth',
    price: 'CAD $199/mo',
    description: 'For teams that publish regularly',
    features: ['4 releases/month', 'Bilingual', 'Priority review', 'Newsroom', 'Advanced analytics'],
    priceId: 'price_growth_monthly',
    featured: true,
  },
  {
    name: 'Agency',
    price: '',
    description: 'For agencies managing multiple clients',
    features: ['Volume credits', 'Team seats', 'White-label', 'API access'],
    priceId: 'price_agency_monthly',
  },
];

export default function PricingPage() {
  return (
    <section className="section bg-wire-bg">
      <div className="container-page">
        <div className="text-center mb-16">
          <h1 className="heading-lg mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-wire-muted">No hidden fees. No sales calls required.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`card p-8 ${plan.featured ? 'ring-2 ring-wire-amber' : ''}`}>
              <h3 className="font-display text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-sm text-wire-muted mb-4">{plan.description}</p>
              {plan.price && (
                <div className="mb-6">
                  <span className="font-display text-3xl font-bold">{plan.price}</span>
                  {plan.price.includes('/mo') && <span className="text-wire-muted"> /month</span>}
                </div>
              )}
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-wire-success mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.featured ? 'default' : 'outline'}>
                {plan.price ? 'Subscribe' : 'Contact Sales'}
              </Button>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div className="card p-8">
          <h2 className="heading-md mb-6">PR NEWS vs. Traditional Newswires</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-semibold pb-2 border-b border-wire-border">Feature</div>
            <div className="font-semibold pb-2 border-b border-wire-border text-wire-amber">PR NEWS</div>
            <div className="font-semibold pb-2 border-b border-wire-border">Others</div>
            {['Transparent pricing', 'Self-serve checkout', 'Live distribution tracking', 'Branded newsroom', 'Bilingual publishing'].map((f) => (
              <div key={f} className="py-3 text-wire-muted">{f}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
