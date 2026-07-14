import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

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

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">Dashboard</h1>
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">My Releases</div>
          <div className="font-display text-3xl font-bold">{myReleases.length}</div>
        </div>
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
      </div>
      <h2 className="heading-md mb-4">Recent Releases</h2>
      {myReleases.length === 0 ? (
        <p className="text-wire-muted">No releases yet. Submit your first!</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-wire-bg">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-wire-muted">Headline</th>
                <th className="text-left px-4 py-2 font-medium text-wire-muted">Status</th>
                <th className="text-left px-4 py-2 font-medium text-wire-muted">Published</th>
                <th className="text-left px-4 py-2 font-medium text-wire-muted">Views</th>
              </tr>
            </thead>
            <tbody>
              {myReleases.map((release: any) => (
                <tr key={release.id} className="border-t border-wire-border">
                  <td className="px-4 py-3 font-medium">{release.headline}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="capitalize">
                      {release.status.toLowerCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-wire-muted">
                    {release.publishedAt?.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-wire-muted">
                    {release.analytics?.length ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
