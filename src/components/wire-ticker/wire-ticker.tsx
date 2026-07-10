'use client';

import { Badge } from '@/components/ui/badge';

interface Release {
  id: string;
  headline: string;
  company: string;
  category: string;
  date: string;
  province: string;
}

// Demo data — replaced by real data in Phase 2
const DEMO_RELEASES: Release[] = [
  {
    id: '1',
    headline: 'Tech Startup Raises $15M Series A to Expand Canadian AI Solutions',
    company: 'MapleAI Inc.',
    category: 'Technology',
    date: '2026-07-10',
    province: 'Ontario',
  },
  {
    id: '2',
    headline: 'BC Mining Company Announces New Sustainable Operations',
    company: 'Pacific Minerals Corp.',
    category: 'Mining',
    date: '2026-07-10',
    province: 'British Columbia',
  },
  {
    id: '3',
    headline: 'Quebec Healthcare Provider Launches Telemedicine Platform',
    company: 'SantéNumérique',
    category: 'Health',
    date: '2026-07-09',
    province: 'Quebec',
  },
  {
    id: '4',
    headline: 'Alberta Oil Sands Operator Invests $50M in Green Technology',
    company: 'Northern Energy Solutions',
    category: 'Energy',
    date: '2026-07-09',
    province: 'Alberta',
  },
  {
    id: '5',
    headline: 'Toronto Real Estate Market Shows Strong Q2 Recovery',
    company: 'Urban Capital Realty',
    category: 'Real Estate',
    date: '2026-07-08',
    province: 'Ontario',
  },
];

export function WireTicker({ releases = DEMO_RELEASES }: { releases?: Release[] }) {
  return (
    <div className="overflow-hidden bg-wire-charcoal text-white py-3">
      <div className="container-page flex items-center gap-3">
        <Badge variant="secondary" className="shrink-0 bg-wire-amber text-wire-charcoal">
          LIVE
        </Badge>
        <span className="text-xs font-medium uppercase tracking-wider shrink-0">Latest Releases:</span>
        <div className="flex gap-8 animate-slide-in whitespace-nowrap">
          {releases.map((release) => (
            <div key={release.id} className="flex items-center gap-2 shrink-0">
              <span className="text-sm">{release.headline}</span>
              <span className="text-wire-amber">—</span>
              <span className="text-xs text-white/60">{release.company} · {release.province}</span>
            </div>
          ))}
          {releases.map((release) => (
            <div key={`dup-${release.id}`} className="flex items-center gap-2 shrink-0">
              <span className="text-sm">{release.headline}</span>
              <span className="text-wire-amber">—</span>
              <span className="text-xs text-white/60">{release.company} · {release.province}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
