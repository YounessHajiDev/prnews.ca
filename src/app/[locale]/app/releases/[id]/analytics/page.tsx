import { BarChart3, Share2, MousePointerClick, Radio, Activity } from 'lucide-react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { notFound, redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';

export default async function ReleaseAnalyticsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const { id } = params;

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

  const totalViews = release.analytics.filter((e: any) => e.eventType === 'view').length;
  const totalShares = release.analytics.filter((e: any) => e.eventType === 'share').length;
  const totalOutlets = release.analytics.filter((e: any) => e.eventType === 'outlet_click').length;

  const stats = [
    { label: 'Views', value: totalViews, icon: BarChart3 },
    { label: 'Shares', value: totalShares, icon: Share2 },
    { label: 'Outlet Clicks', value: totalOutlets, icon: MousePointerClick },
    { label: 'Distribution', value: release.distributionLogs?.length ?? 0, icon: Radio },
  ];

  return (
    <div className="p-4 md:p-8">
      <p className="dateline mb-2">ANALYTICS · {release.status}</p>
      <h1 className="heading-lg mb-6">{release.headline}</h1>

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

      <h2 className="heading-md mb-4">Recent Events</h2>
      {release.analytics.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No events yet"
          description="Once your release is distributed, views, shares, and outlet clicks will appear here."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-wire-paper">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-wire-slate">Event</th>
                  <th className="px-4 py-3 text-left font-medium text-wire-slate">Geo</th>
                  <th className="px-4 py-3 text-left font-medium text-wire-slate">Referrer</th>
                  <th className="px-4 py-3 text-left font-medium text-wire-slate">Timestamp</th>
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
                      {event.timestamp.toLocaleString()}
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
