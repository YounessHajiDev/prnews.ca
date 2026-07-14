import Link from 'next/link';
import { Check, Minus, X } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

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
    price: 'CAD $199',
    priceSuffix: '/month',
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

const COMPARISON_ROWS: { feature: string; prnews: boolean; others: boolean | 'partial' }[] = [
  { feature: 'Transparent, public pricing', prnews: true, others: false },
  { feature: 'Self-serve checkout', prnews: true, others: false },
  { feature: 'Live distribution tracking', prnews: true, others: 'partial' },
  { feature: 'Bilingual English / French publishing', prnews: true, others: false },
  { feature: 'Branded newsroom', prnews: true, others: 'partial' },
  { feature: 'No sales call required', prnews: true, others: false },
  { feature: 'Real-time analytics dashboard', prnews: true, others: 'partial' },
  { feature: 'Canadian media outlet focus', prnews: true, others: false },
];

function ComparisonCell({ value }: { value: boolean | 'partial' }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-wire-success">
        <Check className="h-4 w-4" />
        Yes
      </span>
    );
  }
  if (value === 'partial') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-wire-slate">
        <Minus className="h-4 w-4" />
        Partial
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-wire-slate">
      <X className="h-4 w-4" />
      No
    </span>
  );
}

export default function PricingPage() {
  return (
    <section className="section bg-wire-paper">
      <div className="container-page">
        <div className="mb-16 text-center">
          <h1 className="heading-lg mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-wire-slate">No hidden fees. No sales calls required.</p>
        </div>

        <div className="mb-20 grid gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`card flex flex-col p-8 ${plan.featured ? 'ring-2 ring-wire-brass' : ''}`}
            >
              <h3 className="font-display text-xl font-bold">{plan.name}</h3>
              <p className="mb-4 text-sm text-wire-slate">{plan.description}</p>
              {plan.price ? (
                <div className="mb-6">
                  <span className="font-display text-3xl font-bold">{plan.price}</span>
                  {(plan as any).priceSuffix && <span className="text-wire-slate"> {(plan as any).priceSuffix}</span>}
                </div>
              ) : (
                <div className="mb-6 font-display text-3xl font-bold">Custom</div>
              )}
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-wire-brass" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.price ? `/api/subscribe?plan=${plan.name.toLowerCase()}` : '/contact'}
                className={buttonVariants({ variant: plan.featured ? 'default' : 'outline', className: 'w-full' })}
              >
                {plan.price ? 'Subscribe' : 'Contact Sales'}
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div className="card overflow-hidden">
          <div className="border-b border-wire-rule bg-wire-ink p-6 text-white">
            <h2 className="heading-md">PR NEWS vs. Traditional Newswires</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-wire-rule">
                  <th className="p-4 font-semibold">Feature</th>
                  <th className="p-4 font-semibold text-wire-brass">PR NEWS</th>
                  <th className="p-4 font-semibold text-wire-slate">Traditional Newswires</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="border-b border-wire-rule last:border-0">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4">
                      <ComparisonCell value={row.prnews} />
                    </td>
                    <td className="p-4">
                      <ComparisonCell value={row.others} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
