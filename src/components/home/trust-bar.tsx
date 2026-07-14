'use client';

import { useTranslations } from 'next-intl';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export function TrustBar() {
  const t = useTranslations('home.trustBar');
  const partners = t.raw('partners') as string[];
  const reducedMotion = useReducedMotion();

  return (
    <section className="border-y border-wire-border bg-wire-paper py-8">
      <div className="container-page mb-4 text-center">
        <p className="text-sm uppercase tracking-widest text-wire-slate">{t('label')}</p>
      </div>
      {reducedMotion ? (
        <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-wire-slate">
          {partners.map((name) => (
            <span key={name} className="font-display text-lg font-semibold">{name}</span>
          ))}
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <div className="flex w-max animate-marquee-slow">
            {[...partners, ...partners].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="mx-8 font-display text-lg font-semibold text-wire-slate whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
