import { MetadataRoute } from 'next';
import { db } from '@/lib/db/prisma';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prnews.ca';

export const revalidate = 86400; // 1 day

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['en', 'fr'];

  const staticPaths = [
    '',
    '/news',
    '/pricing',
    '/how-it-works',
    '/about',
    '/contact',
    '/journalists',
    '/resources',
    '/privacy',
    '/terms',
    '/accessibility-statement',
    '/casl-compliance',
  ];

  const staticEntries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const path of staticPaths) {
      staticEntries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${siteUrl}/${l}${path}`])
          ) as Record<string, string>,
        },
      });
    }
  }

  const [releases, companies, categories] = await Promise.all([
    db.pressRelease.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, categorySlug: true, publishedAt: true, updatedAt: true },
    }),
    db.company.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    db.pressRelease.groupBy({
      by: ['categorySlug'],
      _count: { categorySlug: true },
    }),
  ]);

  const releaseEntries: MetadataRoute.Sitemap = [];
  for (const release of releases) {
    for (const locale of locales) {
      releaseEntries.push({
        url: `${siteUrl}/${locale}/news/${release.categorySlug}/${release.slug}`,
        lastModified: release.publishedAt || release.updatedAt || new Date(),
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${siteUrl}/${l}/news/${release.categorySlug}/${release.slug}`])
          ) as Record<string, string>,
        },
      });
    }
  }

  const newsroomEntries: MetadataRoute.Sitemap = [];
  for (const company of companies) {
    for (const locale of locales) {
      newsroomEntries.push({
        url: `${siteUrl}/${locale}/newsroom/${company.slug}`,
        lastModified: company.updatedAt || new Date(),
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${siteUrl}/${l}/newsroom/${company.slug}`])
          ) as Record<string, string>,
        },
      });
    }
  }

  const categoryEntries: MetadataRoute.Sitemap = [];
  for (const category of categories) {
    if (!category.categorySlug) continue;
    for (const locale of locales) {
      categoryEntries.push({
        url: `${siteUrl}/${locale}/news/${category.categorySlug}`,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${siteUrl}/${l}/news/${category.categorySlug}`])
          ) as Record<string, string>,
        },
      });
    }
  }

  return [...staticEntries, ...releaseEntries, ...newsroomEntries, ...categoryEntries];
}
