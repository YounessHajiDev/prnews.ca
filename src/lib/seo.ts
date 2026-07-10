export function generateReleaseMetadata(
  release: {
    headline: string;
    headlineFr?: string;
    summary: string;
    publishedAt?: Date;
    slug: string;
    categorySlug: string;
    company?: { name: string; slug: string; logoUrl?: string } | null;
  },
  locale: string
) {
  const url = `https://prnews.ca/${locale}/news/${release.categorySlug}/${release.slug}`;
  const datePublished = release.publishedAt ?? new Date();
  const companyName = release.company?.name ?? 'PR NEWS';
  const companySlug = release.company?.slug ?? 'prnews';

  return {
    title: release.headline,
    description: release.summary,
    alternates: {
      canonical: url,
      languages: {
        en: `/en/news/${release.categorySlug}/${release.slug}`,
        fr: `/fr/news/${release.categorySlug}/${release.slug}`,
      } satisfies Record<string, string>,
    },
    openGraph: {
      type: 'article',
      title: release.headline,
      description: release.summary,
      publishedTime: datePublished.toISOString(),
      url,
      siteName: 'PR NEWS',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      authors: [companyName],
    },
    twitter: {
      card: 'summary_large_image',
      title: release.headline,
      description: release.summary,
    },
    other: {
      'article:published_time': datePublished.toISOString(),
      'article:modified_time': datePublished.toISOString(),
      'article:section': release.categorySlug,
    },
  };
}

export function getStructuredData(release: {
  headline: string;
  headlineFr?: string;
  summary: string;
  body: string;
  publishedAt?: Date;
  slug: string;
  categorySlug: string;
  company?: { name: string; slug: string; logoUrl?: string; boilerplate?: string } | null;
}, locale: string): string {
  const companyName = release.company?.name ?? 'PR NEWS';
  const companySlug = release.company?.slug ?? 'prnews';
  const url = `https://prnews.ca/${locale}/news/${release.categorySlug}/${release.slug}`;
  const datePublished = release.publishedAt ?? new Date();
  const logoUrl = release.company?.logoUrl || 'https://prnews.ca/logo.png';
  const boilerplate = release.company?.boilerplate || '';

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsArticle',
        '@id': `${url}#article`,
        headline: release.headline,
        description: release.summary,
        articleBody: release.body.replace(/<[^>]*>/g, ''),
        datePublished: datePublished.toISOString(),
        dateModified: datePublished.toISOString(),
        author: {
          '@type': 'Organization',
          name: companyName,
        },
        publisher: {
          '@type': 'Organization',
          name: 'PR NEWS',
          logo: {
            '@type': 'ImageObject',
            url: logoUrl,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        wordCount: release.body.split(/\s+/).length,
        articleSection: release.categorySlug,
        inLanguage: locale === 'fr' ? 'fr-CA' : 'en-CA',
      },
      {
        '@type': 'Organization',
        name: companyName,
        ...(companySlug && { url: `https://prnews.ca/newsroom/${companySlug}` }),
        ...(boilerplate && { description: boilerplate }),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://prnews.ca',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'News',
            item: `https://prnews.ca/${locale}/news`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: release.headline,
            item: url,
          },
        ],
      },
    ],
  };

  return JSON.stringify(data, null, 2);
}

export function getNewsroomStructuredData(company: {
  name: string;
  slug: string;
  logoUrl?: string;
  boilerplate?: string;
}, locale: string): string {
  const url = `https://prnews.ca/${locale}/newsroom/${company.slug}`;
  const logoUrl = company.logoUrl || 'https://prnews.ca/logo.png';

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: company.name,
        url,
        ...(company.boilerplate && { description: company.boilerplate }),
        ...(logoUrl && { logo: { '@type': 'ImageObject', url: logoUrl } }),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://prnews.ca',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Newsrooms',
            item: `https://prnews.ca/${locale}/newsroom`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: company.name,
            item: url,
          },
        ],
      },
    ],
  };

  return JSON.stringify(data, null, 2);
}
