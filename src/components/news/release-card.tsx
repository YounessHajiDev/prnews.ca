import Link from 'next/link';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { getTranslations, getLocale } from 'next-intl/server';

interface ReleaseCardProps {
  release: {
    id: string;
    headline: string;
    summary: string;
    category: string;
    province?: string;
    company: string;
    publishedAt: Date;
    slug: string;
  };
}

export async function ReleaseCard({ release }: ReleaseCardProps) {
  const t = await getTranslations('releaseCard');
  const locale = await getLocale();
  const href = `/news/${release.category.toLowerCase().replace(/\s+/g, '-')}/${release.slug}`;

  return (
    <article className="card group overflow-hidden transition-shadow hover:shadow-md">
      <div className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {release.category}
          </Badge>
          {release.province && (
            <span className="flex items-center gap-1 text-xs text-wire-slate">
              <MapPin className="h-3 w-3" />
              {release.province}
            </span>
          )}
        </div>
        <h3 className="mb-2 font-display text-lg font-semibold transition-colors group-hover:text-wire-brass-dark">
          <Link href={href} className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wire-brass focus-visible:ring-offset-2">
            {release.headline}
          </Link>
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-wire-slate">{release.summary}</p>
        <div className="flex items-center justify-between text-xs text-wire-slate">
          <div className="flex items-center gap-3">
            <span className="font-medium text-wire-ink">{release.company}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(release.publishedAt, locale)}
            </span>
          </div>
          <Link
            href={href}
            className="flex items-center gap-1 rounded-sm text-wire-brass-dark hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wire-brass focus-visible:ring-offset-2"
          >
            {t('read')} <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
