import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function AdminDistributionPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') notFound();

  const t = await getTranslations('admin.distributionPartners');

  const partners = await db.distributionPartner.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">{t('title')}</h1>
      <p className="text-wire-muted mb-6">{t('count', { count: partners.length })}</p>
      <p className="text-wire-muted">{t('comingSoon')}</p>
    </div>
  );
}
