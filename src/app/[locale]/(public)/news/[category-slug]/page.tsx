import { db } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import { ReleaseGrid } from '@/components/news/release-grid';
import { Breadcrumb } from '@/components/layout/breadcrumb';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

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
          { label: 'News', href: '/news' },
          { label: categorySlug },
        ]} />
        <h1 className="heading-lg mb-2">{categorySlug}</h1>
        <p className="text-wire-muted mb-8">
          {releases.length} press releases in this category.
        </p>
        {releases.length === 0 ? (
          <p className="text-wire-muted">No releases in this category yet.</p>
        ) : (
          <ReleaseGrid
            releases={releases.map((r) => ({
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
