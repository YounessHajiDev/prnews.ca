import { type Metadata } from 'next';

export function generateReleaseMetadata(
  release: {
    headline: string;
    summary: string;
    publishedAt?: Date;
    slug: string;
    categorySlug: string;
  },
  locale: string
): Metadata {
  const url = `https://prnews.ca/${locale}/news/${release.categorySlug}/${release.slug}`;
  const datePublished = release.publishedAt ?? new Date();

  return {
    title: release.headline,
    description: release.summary,
    openGraph: {
      title: release.headline,
      description: release.summary,
      type: 'article',
      publishedTime: datePublished.toISOString(),
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: release.headline,
      description: release.summary,
    },
  };
}
