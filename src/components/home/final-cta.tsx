'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/ui/animated-section';
import { buttonVariants } from '@/components/ui/button';

export function FinalCta() {
  const t = useTranslations('home');

  return (
    <section className="relative overflow-hidden bg-wire-ink py-24 text-white md:py-32">
      {/* animated gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-wire-ink via-wire-ink to-wire-brass/20 opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(184,146,74,0.15),transparent_50%)]" />

      <div className="container-page relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl mb-6">
              {t('finalCta.headline')}
            </h2>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={120}>
            <p className="mb-10 text-lg text-white/80 md:text-xl">
              {t('finalCta.subheadline')}
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={240}>
            <Link href="/signup" className={buttonVariants({ size: 'lg', className: 'px-8 py-6 text-lg' })}>
              {t('finalCta.cta')}
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
