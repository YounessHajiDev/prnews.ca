import { db } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/breadcrumb';

export default async function NewsroomPage({
  params,
}: {
  params: { companySlug: string };
}) {
  const { companySlug } = params;

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
      <div className="container-narrow">
        <Breadcrumb items={[
          { label: 'Newsrooms', href: '/newsroom' },
          { label: company.name },
        ]} />

        <header className="mb-8">
          {company.logoUrl && (
            <img
              src={company.logoUrl}
              alt={`${company.name} logo`}
              className="w-16 h-16 rounded-lg mb-4"
            />
          )}
          <h1 className="heading-lg mb-2">{company.name}</h1>
          {company.bio && <p className="text-wire-muted">{company.bio}</p>}
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-wire-amber hover:underline"
            >
              {company.website}
            </a>
          )}
        </header>

        <h2 className="heading-md mb-4">Press Releases</h2>
        {company.releases.length === 0 ? (
          <p className="text-wire-muted">No releases yet from {company.name}.</p>
        ) : (
          <div className="space-y-4">
            {company.releases.map((release: any) => (
              <div key={release.id} className="card p-6">
                <h3 className="font-display font-semibold mb-2">
                  <a href={`/news/${release.categorySlug}/${release.slug}`} className="hover:text-wire-amber">
                    {release.headline}
                  </a>
                </h3>
                <p className="text-sm text-wire-muted mb-2 line-clamp-2">{release.summary}</p>
                <div className="text-xs text-wire-muted">
                  {release.publishedAt?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
