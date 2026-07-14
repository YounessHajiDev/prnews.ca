'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import CanadaMapData from '@svg-country-maps/canada';

interface DistributionPoint {
  id: string;
  x: number;
  y: number;
  active?: boolean;
}

interface CanadaMapProps {
  distributionPoints?: DistributionPoint[];
}

const GRID_STEP = 16;

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
  const t = useTranslations('canadaMap');
  const reducedMotion = useReducedMotion();
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());

  const viewBoxParts = CanadaMapData.viewBox.split(' ').map(Number);
  const viewBoxW = viewBoxParts[2] ?? 793;
  const viewBoxH = viewBoxParts[3] ?? 1032;

  const dots = useMemo(() => {
    const list: { id: string; x: number; y: number; baseOpacity: number; delay: number }[] = [];
    let index = 0;
    for (let x = 0; x <= viewBoxW; x += GRID_STEP) {
      for (let y = 0; y <= viewBoxH; y += GRID_STEP) {
        const rand = seededRandom(index);
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
  }, [viewBoxW, viewBoxH]);

  useEffect(() => {
    if (reducedMotion) {
      setActiveIds(new Set());
      return;
    }

    const pickActive = () => {
      const next = new Set<string>();
      const count = Math.floor(dots.length * 0.03);
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

  const dataActiveIds = useMemo(
    () => new Set((distributionPoints ?? []).filter((p) => p.active).map((p) => p.id)),
    [distributionPoints]
  );
  const effectiveActiveIds = distributionPoints?.length ? dataActiveIds : activeIds;

  return (
    <div className="relative mx-auto flex h-[55vh] max-h-[520px] w-full items-center justify-center">
      <svg
        viewBox={CanadaMapData.viewBox}
        className="h-full w-auto"
        preserveAspectRatio="xMidYMid meet"
        aria-label={t('ariaLabel')}
      >
        <defs>
          <clipPath id="canada-clip">
            {CanadaMapData.locations.map((loc) => (
              <path key={loc.id} d={loc.path} />
            ))}
          </clipPath>
        </defs>

        {/* Landmass base */}
        <g clipPath="url(#canada-clip)">
          <rect x="0" y="0" width={viewBoxW} height={viewBoxH} className="fill-wire-brass/5" />
        </g>

        {/* Distribution dot matrix */}
        <g clipPath="url(#canada-clip)">
          {dots.map((dot) => {
            const active = effectiveActiveIds.has(dot.id);
            return (
              <circle
                key={dot.id}
                cx={dot.x}
                cy={dot.y}
                r={active ? 2.2 : 1.5}
                className={active ? 'fill-wire-red animate-pulse-node' : 'fill-wire-brass'}
                style={{
                  opacity: active ? 1 : dot.baseOpacity,
                  animationDelay: active ? `${dot.delay}s` : undefined,
                }}
              />
            );
          })}
        </g>

        {/* Province / territory boundaries */}
        <g className="pointer-events-none">
          {CanadaMapData.locations.map((loc) => (
            <path
              key={loc.id}
              d={loc.path}
              className="fill-none stroke-wire-ink/10"
              strokeWidth={1}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
