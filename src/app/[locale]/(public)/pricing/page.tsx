import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter',
    description: 'Perfect for one-off announcements',
    price: 'CAD $299',
    period: '',
    features: [
      '1 press release',
      'National distribution',
      '1 category',
      'Basic analytics',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Growth',
    description: 'For teams that publish regularly',
    price: 'CAD $199',
    period: '/month',
    features: [
      '4 releases per month',
      'Both English and French',
      'Priority review (under 1 hour)',
      'Branded newsroom',
      'Advanced analytics',
    ],
    cta: 'Subscribe',
    highlighted: true,
  },
  {
    name: 'Agency',
    description: 'For agencies managing multiple clients',
    price: '',
    period: '',
    features: [
      'Volume credits',
      'Team seats',
      'White-label newsroom',
      'API access',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const COMPARISON = [
  { feature: 'Transparent pricing', prnews: true, other: false },
  { feature: 'Self-serve checkout', prnews: true, other: false },
  { feature: 'Live distribution tracking', prnews: true, other: false },
  { feature: 'Branded newsroom', prnews: true, other: false },
  { feature: 'Bilingual publishing', prnews: true, other: true },
  { feature: 'Video pricing', prnews: false, other: true },
  { feature: 'Opaque delivery status', prnews: false, other: true },
];

export default function PricingPage() {
  return (
    <section className="section bg-wire-bg">
      <div className="container-page">
        <div className="text-center mb-16">
          <h1 className="heading-lg mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-wire-muted">No hidden fees. No sales calls required.</p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`card p-8 ${plan.highlighted ? 'ring-2 ring-wire-amber' : ''}`}
            >
              <h3 className="font-display text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-sm text-wire-muted mb-4">{plan.description}</p>
              {plan.price && (
                <div className="mb-6">
                  <span className="font-display text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-wire-muted"> {plan.period}</span>}
                </div>
              )}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-wire-success mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.highlighted ? 'default' : 'outline'}>
                {plan.cta}
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
            {COMPARISON.map((row) => (
              <div key={row.feature} className="py-3 text-wire-muted">
                {row.feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
