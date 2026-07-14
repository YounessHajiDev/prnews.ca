import { FileText, BarChart3, Share2, MousePointerClick } from 'lucide-react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/utils';
import { getTranslations, getLocale } from 'next-intl/server';

const STAT_ICONS = {
  releases: FileText,
  views: BarChart3,
  shares: Share2,
  outlets: MousePointerClick,
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const t = await getTranslations('dashboard');
  const tc = await getTranslations('common');
  const locale = await getLocale();

  const myReleases = await db.pressRelease.findMany({
    where: { authorId: session.user.id },
    orderBy: { publishedAt: 'desc' },
    take: 10,
  });

  const totalViews = await db.analyticsEvent.count({
    where: {
      eventType: 'view',
      release: { authorId: session.user.id },
    },
  });

  const totalShares = await db.analyticsEvent.count({
    where: {
      eventType: 'share',
      release: { authorId: session.user.id },
    },
  });

  const totalOutlets = await db.analyticsEvent.count({
    where: {
      eventType: 'outlet_click',
      release: { authorId: session.user.id },
    },
  });

  const stats = [
    { label: t('myReleases'), value: myReleases.length, icon: STAT_ICONS.releases },
    { label: t('views'), value: totalViews, icon: STAT_ICONS.views },
    { label: t('shares'), value: totalShares, icon: STAT_ICONS.shares },
    { label: t('outletClicks'), value: totalOutlets, icon: STAT_ICONS.outlets },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="heading-lg mb-6">{t('title')}</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-wire-rule bg-wire-paper">
              <Icon className="h-5 w-5 text-wire-brass" />
            </div>
            <div>
              <div className="text-sm text-wire-slate">{label}</div>
              <div className="font-display text-2xl font-bold">{value}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="heading-md mb-4">{t('recentReleases')}</h2>
      {myReleases.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={t('empty.title')}
          description={t('empty.description')}
          action={{ label: t('empty.action'), href: '/app/submit' }}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-wire-paper">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-wire-slate">{t('table.headline')}</th>
                  <th className="px-4 py-3 text-left font-medium text-wire-slate">{t('table.status')}</th>
                  <th className="px-4 py-3 text-left font-medium text-wire-slate">{t('table.published')}</th>
                  <th className="px-4 py-3 text-left font-medium text-wire-slate">{t('table.views')}</th>
                </tr>
              </thead>
              <tbody>
                {myReleases.map((release: any) => (
                  <tr key={release.id} className="border-t border-wire-rule">
                    <td className="px-4 py-3 font-medium">{release.headline}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="capitalize">
                        {release.status.toLowerCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-wire-slate">
                      {release.publishedAt ? formatDate(release.publishedAt, locale) : '—'}
                    </td>
                    <td className="px-4 py-3 text-wire-slate">
                      {release.analytics?.length ?? 0}
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
