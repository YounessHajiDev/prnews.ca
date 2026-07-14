import { BarChart3, Share2, MousePointerClick, Radio, Activity } from 'lucide-react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { notFound, redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { getTranslations, getLocale } from 'next-intl/server';

export default async function ReleaseAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const { id } = await params;
  const t = await getTranslations('analytics');
  const locale = await getLocale();

  const release = await db.pressRelease.findUnique({
    where: { id },
    include: {
      analytics: {
        orderBy: { timestamp: 'desc' },
        take: 100,
      },
      distributionLogs: {
        include: { partner: true },
      },
    },
  });

  if (!release) {
    notFound();
  }

  if (release.authorId !== session.user.id && !['ADMIN', 'EDITOR'].includes(session.user.role as string)) {
    notFound();
  }

  const totalViews = release.analytics.filter((e: any) => e.eventType === 'view').length;
  const totalShares = release.analytics.filter((e: any) => e.eventType === 'share').length;
  const totalOutlets = release.analytics.filter((e: any) => e.eventType === 'outlet_click').length;

  const stats = [
    { label: t('views'), value: totalViews, icon: BarChart3 },
    { label: t('shares'), value: totalShares, icon: Share2 },
    { label: t('outletClicks'), value: totalOutlets, icon: MousePointerClick },
    { label: t('distribution'), value: release.distributionLogs?.length ?? 0, icon: Radio },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="heading-lg mb-6">{t('title', { headline: release.headline })}</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-wire-rule bg-wire-paper">
              <Icon className="h-5 w-5 text-wire-brass-dark" />
            </div>
            <div>
              <div className="text-sm text-wire-slate">{label}</div>
              <div className="font-display text-2xl font-bold">{value}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="heading-md mb-4">{t('recentEvents')}</h2>
      {release.analytics.length === 0 ? (
        <EmptyState
          icon={Activity}
          title={t('empty.title')}
          description={t('empty.description')}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-wire-paper">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-wire-slate">{t('table.event')}</th>
                  <th className="px-4 py-3 text-left font-medium text-wire-slate">{t('table.geo')}</th>
                  <th className="px-4 py-3 text-left font-medium text-wire-slate">{t('table.referrer')}</th>
                  <th className="px-4 py-3 text-left font-medium text-wire-slate">{t('table.timestamp')}</th>
                </tr>
              </thead>
              <tbody>
                {release.analytics.slice(0, 20).map((event: any) => (
                  <tr key={event.id} className="border-t border-wire-rule">
                    <td className="px-4 py-3 capitalize">
                      <Badge variant="secondary">{event.eventType}</Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-wire-slate">
                      {event.geo || '—'}
                    </td>
                    <td className="px-4 py-3 text-wire-slate">{event.referrer || '—'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-wire-slate">
                      {new Date(event.timestamp).toLocaleString(locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
