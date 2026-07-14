import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { QueueActions } from '@/components/admin/queue-actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminQueuePage({
  params,
}: {
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'EDITOR')) {
    notFound();
  }

  const t = await getTranslations('admin.queue');

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
        <h1 className="heading-lg">{t('title')}</h1>
        <span className="text-sm text-wire-muted">{t('pending', { count: pendingReleases.length })}</span>
      </div>

      {pendingReleases.length === 0 ? (
        <div className="card p-8 text-center">
          <Clock className="w-12 h-12 mx-auto text-wire-muted mb-4" />
          <p className="text-wire-muted">{t('noPending')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingReleases.map((release: any) => (
            <div key={release.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-lg">{release.headline}</h3>
                  <p className="text-sm text-wire-muted mt-1">
                    {release.company?.name} · {t('submittedBy', { name: release.author?.name || release.author?.email })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-wire-muted mb-4 line-clamp-2">{release.summary}</p>
              <QueueActions
                releaseId={release.id}
                approveLabel={t('approve')}
                rejectLabel={t('reject')}
                requestLabel={t('requestChanges')}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
