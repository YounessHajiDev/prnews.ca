import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import { formatDate } from '@/lib/utils';

export default async function SubmitPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const t = await getTranslations('submit');
  const locale = await getLocale();

  const drafts = await db.pressRelease.findMany({
    where: { authorId: session.user.id, status: 'DRAFT' },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">{t('title')}</h1>
      {drafts.length > 0 && (
        <div className="card p-4 mb-6">
          <h2 className="text-sm font-medium mb-2">{t('drafts')}</h2>
          {drafts.map((r: any) => (
            <div key={r.id} className="flex items-center justify-between py-2 border-b border-wire-border last:border-0">
              <span className="text-sm">{r.headline}</span>
              <span className="text-xs text-wire-muted">{formatDate(r.createdAt, locale)}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-wire-muted">{t('comingSoon')}</p>
    </div>
  );
}
