import { Metadata } from 'next';
import { db } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import { ReleaseGrid } from '@/components/news/release-grid';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { getTranslations } from 'next-intl/server';
import { getCategoryStructuredData } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: { 'category-slug': string; locale: string };
}): Promise<Metadata> {
  const { 'category-slug': categorySlug, locale } = params;
  const title = `${categorySlug} — PR NEWS`;
  const url = `https://prnews.ca/${locale}/news/${categorySlug}`;
  return {
    title,
    description: `Latest ${categorySlug} press releases on PR NEWS`,
    alternates: {
      canonical: url,
      languages: {
        'en-CA': `https://prnews.ca/en/news/${categorySlug}`,
        'fr-CA': `https://prnews.ca/fr/news/${categorySlug}`,
        'x-default': `https://prnews.ca/en/news/${categorySlug}`,
      },
    },
    openGraph: {
      title,
      description: `Latest ${categorySlug} press releases on PR NEWS`,
      url,
      siteName: 'PR NEWS',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { 'category-slug': string; locale: string };
}) {
  const { 'category-slug': categorySlug, locale } = params;
  const t = await getTranslations({ locale, namespace: 'news' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const releases = await db.pressRelease.findMany({
    where: {
      categorySlug,
      status: 'PUBLISHED',
    },
    orderBy: { publishedAt: 'desc' },
    take: 20,
    include: {
      company: { select: { name: true, slug: true } },
    },
  });

  return (
    <section className="section bg-wire-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: getCategoryStructuredData(categorySlug, locale),
        }}
      />
      <div className="container-page">
        <Breadcrumb items={[
          { label: tNav('news'), href: '/news' },
          { label: categorySlug },
        ]} />
        <h1 className="heading-lg mb-2">{categorySlug}</h1>
        <p className="text-wire-muted mb-8">
          {t('category.pressReleasesInCategory', { count: releases.length })}
        </p>
        {releases.length === 0 ? (
          <p className="text-wire-muted">{t('category.noReleases')}</p>
        ) : (
          <ReleaseGrid
            releases={releases.map((r: any) => ({
              id: r.id,
              headline: r.headline,
              summary: r.summary,
              category: r.categorySlug,
              province: r.province ?? undefined,
              company: r.company?.name ?? 'PR NEWS',
              publishedAt: r.publishedAt ?? r.createdAt,
              slug: r.slug,
            }))}
          />
        )}
      </div>
    </section>
  );
}
