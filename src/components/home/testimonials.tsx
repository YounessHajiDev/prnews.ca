'use client';

import { useTranslations } from 'next-intl';
import { Quote } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/animated-section';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export function Testimonials() {
  const t = useTranslations('home');
  const items = t.raw('testimonials.items') as Testimonial[];

  return (
    <section className="section bg-wire-surface">
      <div className="container-page">
        <AnimatedSection animation="fade-up" className="mb-4 text-center">
          <p className="dateline mb-3">{t('testimonials.eyebrow')}</p>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={100} className="mx-auto mb-6 max-w-3xl text-center">
          <h2 className="heading-lg mb-4">{t('testimonials.title')}</h2>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={200} className="mx-auto mb-16 max-w-2xl text-center">
          <p className="body-large text-wire-slate">{t('testimonials.subtitle')}</p>
        </AnimatedSection>

        <div className="grid gap-8 md:grid-cols-3">
          {items.map((item, i) => (
            <AnimatedSection key={item.author} animation="fade-up" delay={i * 120}>
              <div className="card flex h-full flex-col p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <Quote className="mb-6 h-8 w-8 text-wire-brass" />
                <blockquote className="mb-8 flex-1 text-lg leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div>
                  <div className="font-display font-semibold">{item.author}</div>
                  <div className="text-sm text-wire-slate">{item.role}, {item.company}</div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
