import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function NewsroomPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const t = await getTranslations('appNewsroom');

  const company = await db.company.findFirst({
    where: { user: { id: session.user.id } },
  });

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">{t('title')}</h1>
      {company ? (
        <a href={`/newsroom/${company.slug}`} className="text-wire-amber hover:underline">
          {company.name}
        </a>
      ) : (
        <p className="text-wire-muted">{t('noNewsroom')}</p>
      )}
    </div>
  );
}
