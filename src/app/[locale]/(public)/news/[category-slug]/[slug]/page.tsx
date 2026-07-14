import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/prisma';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { formatDate } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import { generateReleaseMetadata, getStructuredData } from '@/lib/seo';
import { sanitizeBody } from '@/lib/sanitize';
import { routing } from '@/i18n/routing';

export const revalidate = 60;

export async function generateStaticParams() {
  const releases = await db.pressRelease.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, categorySlug: true },
    take: 100,
  });

  const allParams: { locale: string; 'category-slug': string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const r of releases) {
      allParams.push({ locale, 'category-slug': r.categorySlug, slug: r.slug });
    }
  }
  return allParams;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ 'category-slug': string; slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, 'category-slug': categorySlug, locale } = await params;
  const release = await db.pressRelease.findFirst({
    where: { slug, categorySlug, status: 'PUBLISHED' },
    select: {
      headline: true,
      headlineFr: true,
      summary: true,
      slug: true,
      publishedAt: true,
      categorySlug: true,
      company: { select: { name: true, slug: true, logoUrl: true } },
      ogImageUrl: true,
    },
  });

  if (!release) return { title: 'Release' };

  const ogImage = release.ogImageUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prnews.ca'}/api/og?title=${encodeURIComponent(release.headline)}`;

  return {
    ...generateReleaseMetadata(release, locale),
    openGraph: {
      ...generateReleaseMetadata(release, locale).openGraph,
      images: [{ url: ogImage }],
    },
    twitter: {
      ...generateReleaseMetadata(release, locale).twitter,
      images: [ogImage],
    },
  };
}

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ 'category-slug': string; slug: string; locale: string }>;
}) {
  const { 'category-slug': categorySlug, slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'news' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const release = await db.pressRelease.findFirst({
    where: { slug, categorySlug, status: 'PUBLISHED' },
    include: {
      company: true,
      author: { select: { name: true } },
      assets: true,
    },
  });

  if (!release) {
    notFound();
  }

  const isFrench = locale === 'fr' && (release.language === 'fr' || release.language === 'both');
  const headline = isFrench && release.headlineFr ? release.headlineFr : release.headline;
  const body = isFrench && release.bodyFr ? release.bodyFr : release.body;
  const structuredData = getStructuredData(release, locale);

  return (
    <article className="section bg-wire-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <div className="container-narrow">
        <Breadcrumb items={[
          { label: tNav('news'), href: '/news' },
          { label: categorySlug, href: `/news/${categorySlug}` },
          { label: headline },
        ]} />

        <header className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-wire-muted">
            <span>{release.publishedAt ? formatDate(release.publishedAt, locale) : '—'}</span>
            <span>&middot;</span>
            <span>{release.categorySlug}</span>
          </div>
          <h1 className="heading-lg mb-4">{headline}</h1>
          <p className="text-lg text-wire-muted">{release.summary}</p>
        </header>

        <div
          className="prose-release mb-12"
          dangerouslySetInnerHTML={{ __html: sanitizeBody(body) }}
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
