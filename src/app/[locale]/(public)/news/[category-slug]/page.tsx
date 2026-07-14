import { Metadata } from 'next';
import { db } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import { ReleaseGrid } from '@/components/news/release-grid';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: { categorySlug: string };
}): Promise<Metadata> {
  const { categorySlug } = params;
  return { title: `${categorySlug} — PR NEWS` };
}

export default async function CategoryPage({
  params,
}: {
  params: { categorySlug: string };
}) {
  const { categorySlug } = params;
  const t = await getTranslations('news');
  const tNav = await getTranslations('nav');

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
