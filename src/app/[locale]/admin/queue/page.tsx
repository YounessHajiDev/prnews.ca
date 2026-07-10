import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default async function AdminQueuePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user?.role !== 'ADMIN' && session.user?.role !== 'EDITOR') redirect('/app');

  const pendingReleases = await db.pressRelease.findMany({
    where: { status: { in: ['SUBMITTED', 'IN_REVIEW'] } },
    orderBy: { createdAt: 'asc' },
    include: {
      company: { select: { name: true, slug: true } },
      author: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="heading-lg">Release Queue</h1>
        <span className="text-sm text-wire-muted">{pendingReleases.length} pending</span>
      </div>

      {pendingReleases.length === 0 ? (
        <div className="card p-8 text-center">
          <Clock className="w-12 h-12 mx-auto text-wire-muted mb-4" />
          <p className="text-wire-muted">No releases pending review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingReleases.map((release) => (
            <div key={release.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-lg">{release.headline}</h3>
                  <p className="text-sm text-wire-muted mt-1">
                    {release.company?.name} · Submitted by {release.author?.name || release.author?.email}
                  </p>
                </div>
              </div>
              <p className="text-sm text-wire-muted mb-4 line-clamp-2">{release.summary}</p>
              <div className="flex items-center gap-3">
                <Button variant="default" size="sm" className="gap-1">
                  <CheckCircle className="w-4 h-4" /> Approve
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <XCircle className="w-4 h-4" /> Reject
                </Button>
                <Button variant="ghost" size="sm">
                  Request Changes
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
