import { Metadata } from 'next';
import { db } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { formatDate } from '@/lib/utils';
import { getTranslations, getLocale } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: { categorySlug: string; slug: string };
}): Promise<Metadata> {
  const { slug, categorySlug } = params;
  const release = await db.pressRelease.findFirst({
    where: { slug, categorySlug, status: 'PUBLISHED' },
    select: { headline: true },
  });
  return { title: release?.headline || 'Release' };
}

export default async function ReleasePage({
  params,
}: {
  params: { categorySlug: string; slug: string };
}) {
  const { categorySlug, slug } = params;
  const t = await getTranslations('news');
  const tNav = await getTranslations('nav');
  const locale = await getLocale();

  const release = await db.pressRelease.findFirst({
    where: {
      slug,
      categorySlug,
      status: 'PUBLISHED',
    },
    include: {
      company: true,
      author: { select: { name: true } },
      assets: true,
    },
  });

  if (!release) {
    notFound();
  }

  return (
    <article className="section bg-wire-bg">
      <div className="container-narrow">
        <Breadcrumb items={[
          { label: tNav('news'), href: '/news' },
          { label: categorySlug, href: `/news/${categorySlug}` },
          { label: release.headline },
        ]} />

        <header className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-wire-muted">
            <span>{release.publishedAt ? formatDate(release.publishedAt, locale) : '—'}</span>
            <span>&middot;</span>
            <span>{release.categorySlug}</span>
          </div>
          <h1 className="heading-lg mb-4">{release.headline}</h1>
          <p className="text-lg text-wire-muted">{release.summary}</p>
        </header>

        <div
          className="prose-release mb-12"
          dangerouslySetInnerHTML={{ __html: release.body }}
        />

        <footer className="border-t border-wire-border pt-8">
          <div className="text-sm text-wire-muted">
            <strong>{t('detail.company')}:</strong> {release.company?.name || 'PR NEWS'}
            {release.province && <span> &middot; {release.province}, {t('detail.canada')}</span>}
          </div>
        </footer>
      </div>
    </article>
  );
}
