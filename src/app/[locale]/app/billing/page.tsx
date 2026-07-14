import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Download, Clock, CheckCircle } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter',
    price: '$299/month',
    features: ['1 release', 'National distribution', 'Basic analytics'],
    priceId: 'price_starter_monthly',
  },
  {
    name: 'Growth',
    price: '$199/month',
    features: ['4 releases', 'Bilingual', 'Priority review', 'Newsroom'],
    priceId: 'price_growth_monthly',
    featured: true,
  },
];

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const subscription = await db.subscription.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  const transactions = await db.creditTransaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">Billing</h1>

      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-lg">Current Plan</h2>
            <p className="text-wire-muted">
              {subscription ? (
                <span>
                  {subscription.tier} plan · {subscription.status}
                  <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'} className="ml-2 capitalize">
                    {subscription.status}
                  </Badge>
                </span>
              ) : (
                'No active subscription'
              )}
            </p>
          </div>
          <form action="/api/billing/portal" method="POST">
            <Button variant="outline" size="sm" type="submit">
              <CreditCard className="w-4 h-4 mr-1" /> Manage
            </Button>
          </form>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {PLANS.map((plan) => (
          <div key={plan.name} className={`card p-6 ${plan.featured ? 'ring-2 ring-wire-amber' : ''}`}>
            <h3 className="font-display font-semibold text-lg mb-1">{plan.name}</h3>
            <p className="text-wire-muted text-sm mb-4">{plan.price}</p>
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
              <input type="hidden" name="userId" value={session.user.id} />
              <Button type="submit" className="w-full" variant={plan.featured ? 'default' : 'outline'}>
                Subscribe
              </Button>
            </form>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-wire-border">
          <h2 className="font-display font-semibold">Transaction History</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-wire-muted">No transactions yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-wire-bg">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-wire-muted">Date</th>
                <th className="text-left px-4 py-2 font-medium text-wire-muted">Type</th>
                <th className="text-left px-4 py-2 font-medium text-wire-muted">Amount</th>
                <th className="text-left px-4 py-2 font-medium text-wire-muted">Reference</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx: any) => (
                <tr key={tx.id} className="border-t border-wire-border">
                  <td className="px-4 py-3 text-wire-muted">
                    {tx.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 capitalize">{tx.type}</td>
                  <td className={`px-4 py-3 ${tx.amount > 0 ? 'text-wire-success' : 'text-wire-error'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount} credits
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
