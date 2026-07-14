import { Newspaper } from 'lucide-react';
import { db } from '@/lib/db/prisma';
import { ReleaseGrid } from '@/components/news/release-grid';
import { EmptyState } from '@/components/ui/empty-state';

export default async function NewsPage() {
  let releases: Awaited<ReturnType<typeof db.pressRelease.findMany>> = [];
  try {
    releases = await db.pressRelease.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 30,
      include: {
        company: { select: { name: true, slug: true } },
      },
    });
  } catch (error) {
    console.error('Failed to fetch releases:', error);
  }

  return (
    <section className="section bg-wire-paper">
      <div className="container-page">
        <h1 className="heading-lg mb-2">News</h1>
        <p className="text-wire-slate mb-8">Latest press releases from companies across Canada.</p>

        {releases.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="No releases yet"
            description="Releases will appear here as soon as they go live. Check back soon or submit your own story."
            action={{ label: 'Submit a release', href: '/app/submit' }}
          />
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
