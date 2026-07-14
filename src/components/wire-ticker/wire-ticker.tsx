'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';

interface Release {
  id: string;
  headline: string;
  company: string;
  category: string;
  date: string;
  province: string;
}

// Demo data — replaced by real data in Phase 2. Province keys map to messages for localization.
const DEMO_RELEASES: Release[] = [
  {
    id: '1',
    headline: 'Tech Startup Raises $15M to Expand Canadian AI Solutions',
    company: 'MapleAI Inc.',
    category: 'Technology',
    date: '2026-07-10',
    province: 'Ontario',
  },
  {
    id: '2',
    headline: 'BC Mining Firm Announces Sustainable Operations',
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
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(media.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  return reduced;
}

function TickerItem({ release }: { release: Release }) {
  return (
    <div className="flex shrink-0 items-center gap-3 px-4">
      <span className="font-mono text-xs uppercase tracking-wider text-white/70">
        {release.province}
      </span>
      <span className="text-sm text-white">{release.headline}</span>
      <span className="text-wire-brass">—</span>
      <span className="font-mono text-xs text-white/60">{release.company}</span>
    </div>
  );
}

export function WireTicker({ releases = DEMO_RELEASES }: { releases?: Release[] }) {
  const t = useTranslations('wireTicker');
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="border-b border-white/10 bg-wire-ink py-3 text-white">
        <div className="container-page flex items-center gap-3">
          <Badge variant="default" className="shrink-0 bg-wire-red text-white uppercase">
            {t('live')}
          </Badge>
          <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-white/70">
            {t('reducedLabel')}
          </span>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {releases.slice(0, 2).map((release) => (
              <span key={release.id} className="truncate text-sm">
                {release.headline} — <span className="text-white/60">{release.company}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const items = [...releases, ...releases];

  return (
    <div className="group overflow-hidden border-b border-white/10 bg-wire-ink py-3 text-white">
      <div className="container-page flex items-center gap-3">
        <Badge variant="default" className="shrink-0 bg-wire-red text-white uppercase">
          {t('live')}
        </Badge>
        <span className="hidden shrink-0 font-mono text-xs uppercase tracking-wider text-white/70 sm:inline">
          {t('label')}
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            {items.map((release, idx) => (
              <TickerItem key={`${release.id}-${idx}`} release={release} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
