'use client';

import { useTranslations } from 'next-intl';
import { PenLine, FileSearch, Send } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/animated-section';

const STEP_ICONS = [PenLine, FileSearch, Send];

interface Step {
  title: string;
  desc: string;
}

export function HowItWorksShort() {
  const t = useTranslations('home');
  const steps = t.raw('howItWorks.steps') as Step[];

  return (
    <section className="section bg-wire-paper">
      <div className="container-page">
        <AnimatedSection animation="fade-up" className="mb-4 text-center">
          <p className="dateline mb-3">{t('howItWorks.eyebrow')}</p>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={100} className="mx-auto mb-6 max-w-3xl text-center">
          <h2 className="heading-lg mb-4">{t('howItWorks.title')}</h2>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={200} className="mx-auto mb-16 max-w-2xl text-center">
          <p className="body-large text-wire-slate">{t('howItWorks.subtitle')}</p>
        </AnimatedSection>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* connector line */}
          <div className="absolute left-0 top-[2.25rem] hidden h-px w-full md:block">
            <div className="mx-auto h-full w-[calc(100%-6rem)] bg-wire-border" />
          </div>

          {steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <AnimatedSection key={step.title} animation="fade-up" delay={i * 150} className="relative">
                <div className="relative z-10 mx-auto mb-6 flex h-18 w-18 items-center justify-center rounded-full border-2 border-wire-brass bg-wire-paper text-wire-brass-dark shadow-sm">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="text-center">
                  <div className="mb-2 font-mono text-sm text-wire-brass-dark">0{i + 1}</div>
                  <h3 className="heading-sm mb-2">{step.title}</h3>
                  <p className="body-base text-wire-slate">{step.desc}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
