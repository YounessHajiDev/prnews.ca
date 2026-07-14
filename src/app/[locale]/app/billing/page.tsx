import { db } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';
import { formatDate } from '@/lib/utils';

interface BillingPlan {
  name: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  priceId: string;
  featured?: boolean;
}

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const t = await getTranslations('billing');
  const tc = await getTranslations('common');
  const locale = await getLocale();

  const subscription = await db.subscription.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  const transactions = await db.creditTransaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const plans = t.raw('plans') as BillingPlan[];

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">{t('title')}</h1>

      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-lg">{t('currentPlan')}</h2>
            <p className="text-wire-muted">
              {subscription ? (
                <span>
                  {subscription.tier} {t('currentPlan').toLowerCase()} · {subscription.status}
                  <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'} className="ml-2 capitalize">
                    {subscription.status}
                  </Badge>
                </span>
              ) : (
                t('noSubscription')
              )}
            </p>
          </div>
          <form action="/api/billing/portal" method="POST">
            <Button variant="outline" size="sm" type="submit">
              <CreditCard className="w-4 h-4 mr-1" /> {tc('manage')}
            </Button>
          </form>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {plans.map((plan) => (
          <div key={plan.name} className={`card p-6 ${plan.featured ? 'ring-2 ring-wire-amber' : ''}`}>
            <h3 className="font-display font-semibold text-lg mb-1">{plan.name}</h3>
            <p className="text-wire-muted text-sm mb-4">
              {plan.price}
              {plan.priceSuffix && <span>{plan.priceSuffix}</span>}
            </p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-wire-success" />
                  {f}
                </li>
              ))}
            </ul>
            <form action="/api/stripe/checkout" method="POST">
              <input type="hidden" name="priceId" value={plan.priceId} />
              <Button type="submit" className="w-full" variant={plan.featured ? 'default' : 'outline'}>
                {tc('subscribe')}
              </Button>
            </form>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-wire-border">
          <h2 className="font-display font-semibold">{t('transactionHistory')}</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-wire-muted">{t('noTransactions')}</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-wire-bg">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-wire-muted">{t('table.date')}</th>
                <th className="text-left px-4 py-2 font-medium text-wire-muted">{t('table.type')}</th>
                <th className="text-left px-4 py-2 font-medium text-wire-muted">{t('table.amount')}</th>
                <th className="text-left px-4 py-2 font-medium text-wire-muted">{t('table.reference')}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx: any) => (
                <tr key={tx.id} className="border-t border-wire-border">
                  <td className="px-4 py-3 text-wire-muted">
                    {formatDate(tx.createdAt, locale)}
                  </td>
                  <td className="px-4 py-3 capitalize">{tx.type}</td>
                  <td className={`px-4 py-3 ${tx.amount > 0 ? 'text-wire-success' : 'text-wire-error'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount} {t('credits')}
                  </td>
                  <td className="px-4 py-3 text-wire-muted">{tx.stripeRef || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
