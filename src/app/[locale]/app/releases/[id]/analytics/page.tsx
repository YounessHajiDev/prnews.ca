import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

export default async function ReleaseAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect('/login');

  const { id } = await params;

  const release = await db.pressRelease.findUnique({
    where: { id },
    include: {
      analytics: {
        orderBy: { timestamp: 'desc' },
        take: 100,
      },
    },
  });

  if (!release) {
    return <div className="p-8">Release not found.</div>;
  }

  const totalViews = release.analytics.filter((e) => e.eventType === 'view').length;
  const totalShares = release.analytics.filter((e) => e.eventType === 'share').length;
  const totalOutlets = release.analytics.filter((e) => e.eventType === 'outlet_click').length;

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">
        Analytics: {release.headline}
      </h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">Views</div>
          <div className="font-display text-3xl font-bold">{totalViews}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">Shares</div>
          <div className="font-display text-3xl font-bold">{totalShares}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">Outlet Clicks</div>
          <div className="font-display text-3xl font-bold">{totalOutlets}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">Distribution</div>
          <div className="font-display text-3xl font-bold">
            {release.distributionLogs?.length ?? 0}
          </div>
        </div>
      </div>

      <h2 className="heading-md mb-4">Recent Events</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-wire-bg">
            <tr>
              <th className="text-left px-4 py-2 font-medium text-wire-muted">Event</th>
              <th className="text-left px-4 py-2 font-medium text-wire-muted">Geo</th>
              <th className="text-left px-4 py-2 font-medium text-wire-muted">Referrer</th>
              <th className="text-left px-4 py-2 font-medium text-wire-muted">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {release.analytics.slice(0, 20).map((event) => (
              <tr key={event.id} className="border-t border-wire-border">
                <td className="px-4 py-3 capitalize">
                  <Badge variant="secondary">{event.eventType}</Badge>
                </td>
                <td className="px-4 py-3 text-wire-muted">{event.geo || '—'}</td>
                <td className="px-4 py-3 text-wire-muted">{event.referrer || '—'}</td>
                <td className="px-4 py-3 text-wire-muted">{event.timestamp.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
