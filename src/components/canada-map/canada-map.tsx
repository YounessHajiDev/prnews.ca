'use client';

import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface DistributionPoint {
  id: string;
  x: number;
  y: number;
  active?: boolean;
}

interface CanadaMapProps {
  distributionPoints?: DistributionPoint[];
}

const PROVINCE_PATHS: Record<string, string> = {
  BC: 'M 150 180 L 200 140 L 250 120 L 280 100 L 320 90 L 360 80 L 380 120 L 370 160 L 340 200 L 300 220 L 260 230 L 220 240 L 180 250 L 150 230 L 130 200 Z',
  AB: 'M 360 80 L 420 70 L 480 70 L 520 80 L 540 120 L 540 180 L 500 200 L 460 210 L 420 220 L 380 210 L 340 200 L 370 160 L 380 120 Z',
  SK: 'M 520 80 L 560 75 L 590 80 L 600 120 L 600 180 L 590 220 L 560 230 L 540 220 L 540 180 L 540 120 Z',
  MB: 'M 590 80 L 630 70 L 660 80 L 670 120 L 660 180 L 650 220 L 620 230 L 590 220 L 600 180 L 600 120 L 590 80 Z',
  ON: 'M 660 80 L 700 60 L 740 50 L 780 60 L 800 100 L 810 140 L 800 180 L 780 210 L 740 220 L 700 210 L 670 200 L 660 180 L 670 120 Z',
  QC: 'M 740 50 L 780 30 L 820 20 L 860 30 L 880 60 L 870 100 L 850 140 L 820 180 L 800 180 L 810 140 L 800 100 Z',
  NB: 'M 850 140 L 870 150 L 880 170 L 870 190 L 850 180 Z',
  NS: 'M 870 190 L 890 200 L 900 220 L 880 230 L 860 210 Z',
  PE: 'M 860 210 L 870 215 L 865 225 L 855 220 Z',
  NL: 'M 900 100 L 920 90 L 940 100 L 930 130 L 910 140 L 895 120 Z',
  YT: 'M 100 80 L 150 60 L 200 50 L 250 50 L 280 60 L 300 80 L 280 100 L 240 110 L 200 110 L 160 100 L 130 95 Z',
  NT: 'M 280 100 L 340 70 L 400 60 L 460 55 L 520 60 L 560 75 L 590 80 L 540 120 L 500 130 L 460 130 L 420 120 L 380 110 L 340 110 L 300 100 Z',
  NU: 'M 560 20 L 620 10 L 680 15 L 740 30 L 780 50 L 800 80 L 780 100 L 740 100 L 700 90 L 660 80 L 620 70 L 580 60 L 560 50 L 550 35 Z',
};

const GRID_STEP = 18;
const VIEWBOX_W = 1000;
const VIEWBOX_H = 300;

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededRandom(seed: number) {
  return mulberry32(seed * 1000 + 123456)();
}

export function CanadaMap({ distributionPoints }: CanadaMapProps) {
  const reducedMotion = useReducedMotion();
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());

  const dots = useMemo(() => {
    const list: { id: string; x: number; y: number; baseOpacity: number; delay: number }[] = [];
    let index = 0;
    for (let x = 0; x <= VIEWBOX_W; x += GRID_STEP) {
      for (let y = 0; y <= VIEWBOX_H; y += GRID_STEP) {
        const rand = seededRandom(index);
        // Jitter dot placement slightly for a less mechanical grid
        const jitter = (rand - 0.5) * 4;
        list.push({
          id: `node-${x}-${y}`,
          x: x + jitter,
          y: y + jitter,
          baseOpacity: 0.12 + rand * 0.28,
          delay: rand * -2.5,
        });
        index++;
      }
    }
    return list;
  }, []);

  useEffect(() => {
    // TODO: wire to real DistributionLog data once available.
    // For now, simulate pulsing nodes on a rotating subset.
    if (reducedMotion) {
      setActiveIds(new Set());
      return;
    }

    const pickActive = () => {
      const next = new Set<string>();
      const count = Math.floor(dots.length * 0.08);
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * dots.length);
        next.add(dots[idx].id);
      }
      setActiveIds(next);
    };

    pickActive();
    const interval = setInterval(pickActive, 3000);
    return () => clearInterval(interval);
  }, [dots, reducedMotion]);

  // Real data can override simulation if provided.
  const dataActiveIds = useMemo(
    () => new Set((distributionPoints ?? []).filter((p) => p.active).map((p) => p.id)),
    [distributionPoints]
  );
  const effectiveActiveIds = distributionPoints?.length ? dataActiveIds : activeIds;

  return (
    <div className="relative mx-auto aspect-[2/1] w-full max-w-4xl">
      <svg viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} className="h-full w-full" aria-label="Dot-matrix map of Canada showing active distribution nodes">
        <defs>
          <clipPath id="canada-clip">
            {Object.entries(PROVINCE_PATHS).map(([code, d]) => (
              <path key={code} d={d} />
            ))}
          </clipPath>
        </defs>

        {/* Background wash inside Canada outline */}
        <g clipPath="url(#canada-clip)">
          <rect x="0" y="0" width={VIEWBOX_W} height={VIEWBOX_H} className="fill-wire-brass/5" />
        </g>

        {/* Dot matrix grid */}
        <g clipPath="url(#canada-clip)">
          {dots.map((dot) => {
            const active = effectiveActiveIds.has(dot.id);
            return (
              <circle
                key={dot.id}
                cx={dot.x}
                cy={dot.y}
                r={active ? 2.2 : 1.6}
                className={active ? 'fill-wire-red animate-pulse-node' : 'fill-wire-brass'}
                style={{
                  opacity: active ? 1 : dot.baseOpacity,
                  animationDelay: active ? `${dot.delay}s` : undefined,
                }}
              />
            );
          })}
        </g>

        {/* Subtle province boundaries */}
        <g className="pointer-events-none">
          {Object.entries(PROVINCE_PATHS).map(([code, d]) => (
            <path key={code} d={d} className="fill-none stroke-wire-ink/10" strokeWidth={1} />
          ))}
        </g>
      </svg>
    </div>
  );
}
