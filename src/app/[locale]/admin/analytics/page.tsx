import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user?.role !== 'ADMIN') redirect('/app');

  const totalReleases = await db.pressRelease.count();
  const totalViews = await db.analyticsEvent.count({
    where: { eventType: 'view' },
  });
  const totalCompanies = await db.company.count();

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">Platform Analytics</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">Total Releases</div>
          <div className="font-display text-3xl font-bold">{totalReleases}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">Total Views</div>
          <div className="font-display text-3xl font-bold">{totalViews}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">Registered Companies</div>
          <div className="font-display text-3xl font-bold">{totalCompanies}</div>
        </div>
      </div>
    </div>
  );
}
