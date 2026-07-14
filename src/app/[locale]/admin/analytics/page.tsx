import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') notFound();

  const t = await getTranslations('admin.analytics');

  const totalReleases = await db.pressRelease.count();
  const totalViews = await db.analyticsEvent.count({
    where: { eventType: 'view' },
  });
  const totalCompanies = await db.company.count();

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">{t('title')}</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">{t('totalReleases')}</div>
          <div className="font-display text-3xl font-bold">{totalReleases}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">{t('totalViews')}</div>
          <div className="font-display text-3xl font-bold">{totalViews}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-wire-muted mb-1">{t('registeredCompanies')}</div>
          <div className="font-display text-3xl font-bold">{totalCompanies}</div>
        </div>
      </div>
    </div>
  );
}
