import { db } from '@/lib/db/prisma';
import { ReleaseGrid } from '@/components/news/release-grid';

export default async function NewsPage() {
  const releases = await db.pressRelease.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 30,
    include: {
      company: { select: { name: true, slug: true } },
    },
  });

  return (
    <section className="section bg-wire-bg">
      <div className="container-page">
        <h1 className="heading-lg mb-2">News</h1>
        <p className="text-wire-muted mb-8">Latest press releases from companies across Canada.</p>
        {releases.length === 0 ? (
          <p className="text-wire-muted">No releases yet.</p>
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
