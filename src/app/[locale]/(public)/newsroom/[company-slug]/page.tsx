import { Metadata } from 'next';
import Image from 'next/image';
import { db } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { formatDate } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import { getNewsroomStructuredData } from '@/lib/seo';
import { routing } from '@/i18n/routing';

export async function generateStaticParams() {
  const companies = await db.company.findMany({
    select: { slug: true },
    take: 200,
  });

  const params: { locale: string; 'company-slug': string }[] = [];
  for (const locale of routing.locales) {
    for (const c of companies) {
      params.push({ locale, 'company-slug': c.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ 'company-slug': string; locale: string }>;
}): Promise<Metadata> {
  const { 'company-slug': companySlug, locale } = await params;
  const company = await db.company.findUnique({
    where: { slug: companySlug },
    select: { name: true, bio: true },
  });
  const title = company?.name || 'Newsroom';
  const url = `https://prnews.ca/${locale}/newsroom/${companySlug}`;
  return {
    title,
    description: company?.bio || `${title} newsroom on PR NEWS`,
    alternates: {
      canonical: url,
      languages: {
        'en-CA': `https://prnews.ca/en/newsroom/${companySlug}`,
        'fr-CA': `https://prnews.ca/fr/newsroom/${companySlug}`,
        'x-default': `https://prnews.ca/en/newsroom/${companySlug}`,
      },
    },
    openGraph: {
      title,
      description: company?.bio || `${title} newsroom on PR NEWS`,
      url,
      siteName: 'PR NEWS',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
    },
  };
}

export default async function NewsroomPage({
  params,
}: {
  params: Promise<{ 'company-slug': string; locale: string }>;
}) {
  const { 'company-slug': companySlug, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'newsroom' });

  const company = await db.company.findUnique({
    where: { slug: companySlug },
    include: {
      releases: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 50,
        include: {
          author: { select: { name: true } },
        },
      },
    },
  });

  if (!company) {
    notFound();
  }

  return (
    <section className="section bg-wire-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: getNewsroomStructuredData(
            {
              name: company.name,
              slug: company.slug,
              logoUrl: company.logoUrl || undefined,
              boilerplate: company.boilerplate || undefined,
            },
            locale
          ),
        }}
      />
      <div className="container-narrow">
        <Breadcrumb items={[
          { label: t('breadcrumb'), href: '/newsroom' },
          { label: company.name },
        ]} />

        <header className="mb-8">
          {company.logoUrl && (
            <Image
              src={company.logoUrl}
              alt={`${company.name} logo`}
              width={64}
              height={64}
              className="w-16 h-16 rounded-lg mb-4 object-contain"
              unoptimized
            />
          )}
          <h1 className="heading-lg mb-2">{company.name}</h1>
          {company.bio && <p className="text-wire-muted">{company.bio}</p>}
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-wire-brass-dark hover:underline"
            >
              {company.website}
            </a>
          )}
        </header>

        <h2 className="heading-md mb-4">{t('pressReleases')}</h2>
        {company.releases.length === 0 ? (
          <p className="text-wire-muted">{t('noReleases', { company: company.name })}</p>
        ) : (
          <div className="space-y-4">
            {company.releases.map((release: any) => (
              <div key={release.id} className="card p-6">
                <h3 className="font-display font-semibold mb-2">
                  <a href={`/news/${release.categorySlug}/${release.slug}`} className="hover:text-wire-brass-dark">
                    {release.headline}
                  </a>
                </h3>
                <p className="text-sm text-wire-muted mb-2 line-clamp-2">{release.summary}</p>
                <div className="text-xs text-wire-muted">
                  {formatDate(release.publishedAt, locale)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
