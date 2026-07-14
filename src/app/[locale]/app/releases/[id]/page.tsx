import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect, notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { getTranslations, getLocale } from 'next-intl/server';
import { formatDate } from '@/lib/utils';

export default async function ReleaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const { id } = await params;
  const t = await getTranslations('releaseDetail');
  const tc = await getTranslations('common');
  const locale = await getLocale();

  const release = await db.pressRelease.findUnique({
    where: { id },
    include: {
      company: { select: { name: true, slug: true } },
      author: { select: { name: true, email: true } },
      distributionLogs: {
        include: { partner: true },
      },
    },
  });

  if (!release) {
    notFound();
  }

  // Multi-tenant isolation: users can only see their own releases; admins/editors can see all
  if (release.authorId !== session.user.id && !['ADMIN', 'EDITOR'].includes(session.user.role as string)) {
    notFound();
  }

  const delivered = release.distributionLogs.filter((l: any) => l.status === 'delivered').length;
  const failed = release.distributionLogs.filter((l: any) => l.status === 'failed').length;
  const pending = release.distributionLogs.filter((l: any) => l.status === 'pending').length;

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">{release.headline}</h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">{tc('status')}</div>
          <Badge variant="secondary" className="capitalize text-sm">
            {release.status.toLowerCase()}
          </Badge>
        </div>
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">{t('delivered')}</div>
          <div className="font-display text-3xl font-bold text-wire-success">{delivered}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">{t('pending')}</div>
          <div className="font-display text-3xl font-bold text-wire-warning">{pending}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">{t('failed')}</div>
          <div className="font-display text-3xl font-bold text-wire-error">{failed}</div>
        </div>
      </div>

      <h2 className="heading-md mb-4">{t('distributionStatus')}</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-wire-bg">
            <tr>
              <th className="text-left px-4 py-2 font-medium text-wire-muted">{t('table.partner')}</th>
              <th className="text-left px-4 py-2 font-medium text-wire-muted">{t('table.status')}</th>
              <th className="text-left px-4 py-2 font-medium text-wire-muted">{t('table.delivered')}</th>
            </tr>
          </thead>
          <tbody>
            {release.distributionLogs.map((log: any) => (
              <tr key={log.id} className="border-t border-wire-border">
                <td className="px-4 py-3 font-medium">{log.partner.name}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      log.status === 'delivered'
                        ? 'default'
                        : log.status === 'failed'
                          ? 'destructive'
                          : 'secondary'
                    }
                    className="capitalize"
                  >
                    {log.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-wire-muted">
                  {log.deliveredAt ? formatDate(log.deliveredAt, locale) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
