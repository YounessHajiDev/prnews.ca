import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default async function ReleaseDetailPage({
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
      company: { select: { name: true, slug: true } },
      author: { select: { name: true } },
      distributionLogs: {
        include: { partner: true },
      },
    },
  });

  if (!release) {
    return <div className="p-8">Release not found.</div>;
  }

  const delivered = release.distributionLogs.filter((l) => l.status === 'delivered').length;
  const failed = release.distributionLogs.filter((l) => l.status === 'failed').length;
  const pending = release.distributionLogs.filter((l) => l.status === 'pending').length;

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">{release.headline}</h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">Status</div>
          <Badge variant="secondary" className="capitalize text-sm">
            {release.status.toLowerCase()}
          </Badge>
        </div>
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">Delivered</div>
          <div className="font-display text-3xl font-bold text-wire-success">{delivered}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">Pending</div>
          <div className="font-display text-3xl font-bold text-wire-warning">{pending}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">Failed</div>
          <div className="font-display text-3xl font-bold text-wire-error">{failed}</div>
        </div>
      </div>

      <h2 className="heading-md mb-4">Distribution Status</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-wire-bg">
            <tr>
              <th className="text-left px-4 py-2 font-medium text-wire-muted">Partner</th>
              <th className="text-left px-4 py-2 font-medium text-wire-muted">Status</th>
              <th className="text-left px-4 py-2 font-medium text-wire-muted">Delivered</th>
            </tr>
          </thead>
          <tbody>
            {release.distributionLogs.map((log) => (
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
                  {log.deliveredAt ? log.deliveredAt.toLocaleString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
