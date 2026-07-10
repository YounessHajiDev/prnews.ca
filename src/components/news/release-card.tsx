import Link from 'next/link';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

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

export function ReleaseCard({ release }: ReleaseCardProps) {
  return (
    <article className="card overflow-hidden group hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            {release.category}
          </Badge>
          {release.province && (
            <span className="flex items-center gap-1 text-xs text-wire-muted">
              <MapPin className="w-3 h-3" />
              {release.province}
            </span>
          )}
        </div>
        <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-wire-amber transition-colors">
          <Link href={`/news/${release.category.toLowerCase().replace(/\s+/g, '-')}/${release.slug}`}>
            {release.headline}
          </Link>
        </h3>
        <p className="text-sm text-wire-muted line-clamp-2 mb-4">
          {release.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-wire-muted">
          <div className="flex items-center gap-3">
            <span className="font-medium text-wire-charcoal">{release.company}</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(release.publishedAt)}
            </span>
          </div>
          <Link
            href={`/news/${release.category.toLowerCase().replace(/\s+/g, '-')}/${release.slug}`}
            className="flex items-center gap-1 text-wire-amber hover:underline"
          >
            Read <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
