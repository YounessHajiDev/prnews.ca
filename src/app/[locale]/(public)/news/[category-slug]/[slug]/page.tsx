import { db } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ categorySlug: string; slug: string }>;
}) {
  const { categorySlug, slug } = await params;

  const release = await db.pressRelease.findFirst({
    where: {
      slug,
      categorySlug,
      status: 'PUBLISHED',
    },
    include: {
      company: true,
      author: { select: { name: true } },
      assets: true,
    },
  });

  if (!release) {
    notFound();
  }

  return (
    <article className="section bg-wire-bg">
      <div className="container-narrow">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-wire-muted">
              {release.publishedAt?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="text-wire-muted">&middot;</span>
            <span className="text-sm text-wire-muted">{release.categorySlug}</span>
          </div>
          <h1 className="heading-lg mb-4">{release.headline}</h1>
          <p className="text-lg text-wire-muted">{release.summary}</p>
        </header>

        <div
          className="prose-release mb-12"
          dangerouslySetInnerHTML={{ __html: release.body }}
        />

        <footer className="border-t border-wire-border pt-8">
          <div className="text-sm text-wire-muted">
            <strong>Company:</strong> {release.company?.name || 'PR NEWS'}
            {release.province && <span> &middot; {release.province}, Canada</span>}
          </div>
        </footer>
      </div>
    </article>
  );
}
