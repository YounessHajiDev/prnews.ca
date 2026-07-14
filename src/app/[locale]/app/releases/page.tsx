import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import { formatDate } from '@/lib/utils';

export default async function ReleasesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const t = await getTranslations('releases');
  const tc = await getTranslations('common');
  const locale = await getLocale();

  const releases = await db.pressRelease.findMany({
    where: { authorId: session.user.id },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  });

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">{t('title')}</h1>
      {releases.length === 0 ? (
        <p className="text-wire-muted">{t('empty')}</p>
      ) : (
        <div className="space-y-4">
          {releases.map((r: any) => (
            <div key={r.id} className="card p-4 flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold">{r.headline}</h3>
                <p className="text-sm text-wire-muted">
                  {r.publishedAt ? formatDate(r.publishedAt, locale) : '—'} · {r.status.toLowerCase()}
                </p>
              </div>
              <a href={`/app/releases/${r.id}`} className="text-sm text-wire-amber hover:underline">
                {t('view')}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
