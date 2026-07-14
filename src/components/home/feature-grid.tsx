'use client';

import { useTranslations } from 'next-intl';
import { Eye, Zap, Languages, MapPin, BarChart3, FileCheck } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/animated-section';

const FEATURES = [
  { key: 'transparency', icon: Eye },
  { key: 'speed', icon: Zap },
  { key: 'bilingual', icon: Languages },
  { key: 'reach', icon: MapPin },
  { key: 'analytics', icon: BarChart3 },
  { key: 'support', icon: FileCheck },
] as const;

export function FeatureGrid() {
  const t = useTranslations('home');

  return (
    <section className="section bg-wire-surface">
      <div className="container-page">
        <AnimatedSection animation="fade-up" className="mb-4 text-center">
          <p className="dateline mb-3">{t('features.eyebrow')}</p>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={100} className="mx-auto mb-6 max-w-3xl text-center">
          <h2 className="heading-lg mb-4">{t('features.title')}</h2>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={200} className="mx-auto mb-14 max-w-2xl text-center">
          <p className="body-large text-wire-slate">{t('features.subtitle')}</p>
        </AnimatedSection>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, icon: Icon }, i) => (
            <AnimatedSection key={key} animation="fade-up" delay={i * 100} className="group">
              <div className="card h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-wire-brass/40">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-wire-brass/20 bg-wire-brass/10 text-wire-brass transition-colors group-hover:bg-wire-brass group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="heading-sm mb-2">{t(`features.${key}.title`)}</h3>
                <p className="body-base text-wire-slate">{t(`features.${key}.desc`)}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
