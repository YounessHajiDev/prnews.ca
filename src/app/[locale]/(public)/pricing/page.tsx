import { Metadata } from 'next';
import Link from 'next/link';
import { Check, Minus, X } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/button';

interface Plan {
  name: string;
  description: string;
  price?: string;
  priceSuffix?: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}

interface ComparisonRow {
  feature: string;
  prnews: 'yes' | 'no' | 'partial';
  others: 'yes' | 'no' | 'partial';
}

type ComparisonValue = 'yes' | 'no' | 'partial';

function ComparisonCell({
  value,
  labels,
}: {
  value: ComparisonValue;
  labels: { yes: string; no: string; partial: string };
}) {
  const icons = {
    yes: Check,
    partial: Minus,
    no: X,
  };
  const styles = {
    yes: 'text-wire-success',
    partial: 'text-wire-slate',
    no: 'text-wire-slate',
  };
  const Icon = icons[value];

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${styles[value]}`}>
      <Icon className="h-4 w-4" />
      {labels[value]}
    </span>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pricing');
  return { title: t('title') };
}

export default async function PricingPage() {
  const t = await getTranslations('pricing');
  const tc = await getTranslations('common');
  const plans = t.raw('plans') as Plan[];
  const rows = t.raw('comparisonRows') as ComparisonRow[];
  const labels = {
    yes: t('comparison.yes'),
    no: t('comparison.no'),
    partial: t('comparison.partial'),
  };

  return (
    <section className="section bg-wire-paper">
      <div className="container-page">
        <div className="mb-16 text-center">
          <h1 className="heading-lg mb-4">{t('title')}</h1>
          <p className="text-lg text-wire-slate">{t('subtitle')}</p>
        </div>

        <div className="mb-20 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card flex flex-col p-8 ${plan.featured ? 'ring-2 ring-wire-brass' : ''}`}
            >
              <h2 className="font-display text-xl font-bold">{plan.name}</h2>
              <p className="mb-4 text-sm text-wire-slate">{plan.description}</p>
              {plan.price ? (
                <div className="mb-6">
                  <span className="font-display text-3xl font-bold">{plan.price}</span>
                  {plan.priceSuffix && <span className="text-wire-slate"> {plan.priceSuffix}</span>}
                </div>
              ) : (
                <div className="mb-6 font-display text-3xl font-bold">{tc('contactSales')}</div>
              )}
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-wire-brass-dark" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={buttonVariants({
                  variant: plan.featured ? 'default' : 'outline',
                  className: 'w-full',
                })}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div className="card overflow-hidden">
          <div className="border-b border-wire-rule bg-wire-ink p-6 text-white">
            <h2 className="heading-md">{t('comparisonTitle')}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-wire-rule">
                  <th className="p-4 font-semibold">{t('comparison.feature')}</th>
                  <th className="p-4 font-semibold text-wire-brass-dark">{t('comparison.prnews')}</th>
                  <th className="p-4 font-semibold text-wire-slate">{t('comparison.others')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.feature} className="border-b border-wire-rule last:border-0">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4">
                      <ComparisonCell value={row.prnews} labels={labels} />
                    </td>
                    <td className="p-4">
                      <ComparisonCell value={row.others} labels={labels} />
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
