import { Metadata } from 'next';
import { db } from '@/lib/db/prisma';
import { ReleaseGrid } from '@/components/news/release-grid';
import { EmptyState } from '@/components/ui/empty-state';
import { FileText } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('news');
  return { title: t('title') };
}

export default async function NewsPage() {
  const t = await getTranslations('news');

  const releases = await db.pressRelease.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 50,
    include: {
      company: { select: { name: true } },
    },
  });

  const mapped = releases.map((r: any) => ({
    id: r.id,
    headline: r.headline,
    summary: r.summary,
    category: r.categoryName || r.categorySlug,
    province: r.province,
    company: r.company?.name || r.companyName || 'PR NEWS',
    publishedAt: r.publishedAt,
    slug: r.slug,
  }));

  return (
    <section className="section bg-wire-surface">
      <div className="container-page">
        <div className="mb-8 md:mb-12">
          <h1 className="heading-lg mb-3">{t('title')}</h1>
          <p className="body-base text-wire-slate">{t('subtitle')}</p>
        </div>

        {releases.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t('empty.title')}
            description={t('empty.description')}
            action={{ label: t('empty.action'), href: '/app/submit' }}
          />
        ) : (
          <ReleaseGrid releases={mapped} />
        )}
      </div>
    </section>
  );
}
