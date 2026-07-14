import { ReleaseCard } from './release-card';

interface ReleaseGridProps {
  releases: Array<{
    id: string;
    headline: string;
    summary: string;
    category: string;
    province?: string;
    company: string;
    publishedAt: Date;
    slug: string;
  }>;
  locale: string;
}

export function ReleaseGrid({ releases, locale }: ReleaseGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {releases.map((release) => (
        <ReleaseCard key={release.id} release={release} locale={locale} />
      ))}
    </div>
  );
}
