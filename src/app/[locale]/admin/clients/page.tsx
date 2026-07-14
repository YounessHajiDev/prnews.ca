import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function AdminClientsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user?.role !== 'ADMIN') redirect('/app');

  const t = await getTranslations('admin.clients');

  const clients = await db.company.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      user: { select: { email: true } },
      releases: { select: { id: true } },
    },
  });

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">{t('title')}</h1>
      <p className="text-wire-muted mb-6">{t('count', { count: clients.length })}</p>
      <p className="text-wire-muted">{t('comingSoon')}</p>
    </div>
  );
}
