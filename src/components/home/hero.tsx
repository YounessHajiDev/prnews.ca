'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, BarChart3, MousePointerClick, Share2 } from 'lucide-react';

function HeroVisual() {
  const tv = useTranslations('home.hero.visual');
  return (
    <div className="relative mx-auto w-full max-w-lg lg:mx-0">
      {/* floating accent cards */}
      <div className="absolute -left-8 -top-6 z-20 hidden animate-float rounded-lg border border-wire-border bg-white p-4 shadow-lg sm:block" style={{ animationDelay: '0s' }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wire-brass/10 text-wire-brass-dark">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-wire-slate">{tv('totalViews')}</div>
            <div className="font-display text-lg font-bold text-wire-ink">12,847</div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 -right-6 z-20 hidden animate-float rounded-lg border border-wire-border bg-white p-4 shadow-lg sm:block" style={{ animationDelay: '2s' }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wire-success/10 text-wire-success">
            <MousePointerClick className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-wire-slate">{tv('outletClicks')}</div>
            <div className="font-display text-lg font-bold text-wire-ink">+482</div>
          </div>
        </div>
      </div>

      {/* main dashboard card */}
      <div className="animate-slide-up relative rounded-2xl border border-wire-border bg-white p-6 text-wire-ink shadow-2xl" style={{ animationDelay: '300ms' }}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className="gap-1.5 bg-wire-red text-white hover:bg-wire-red">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              {tv('live')}
            </Badge>
            <span className="font-display font-semibold">{tv('title')}</span>
          </div>
          <Share2 className="h-5 w-5 text-wire-slate" />
        </div>

        <div className="space-y-4">
          {[
            { outlet: 'CBC News', status: 'Delivered' },
            { outlet: 'CTV News', status: 'Delivered' },
            { outlet: 'Global News', status: 'Picked up' },
            { outlet: 'La Presse', status: 'Delivered' },
          ].map((row) => (
            <div key={row.outlet} className="flex items-center justify-between rounded-lg bg-wire-paper p-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-wire-ink/5" />
                <span className="font-medium">{row.outlet}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-wire-success">
                <CheckCircle2 className="h-4 w-4" />
                {row.status === 'Picked up' ? tv('pickedUp') : tv('delivered')}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-wire-slate">{tv('audienceReach')}</span>
            <span className="font-semibold">78%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-wire-border">
            <div className="h-full w-[78%] rounded-full bg-wire-brass" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative overflow-hidden bg-wire-ink py-24 text-white md:py-32 lg:py-40">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,146,74,0.15),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(184,146,74,0.10),transparent_40%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-wire-brass/10" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-wire-brass/5" />

      <div className="container-page relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex animate-slide-up items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-wire-brass-light">
              <span className="h-1.5 w-1.5 rounded-full bg-wire-brass-light animate-pulse" />
              {t('eyebrow')}
            </div>

            <h1 className="heading-xl mb-6 text-white">
              {t('headline')}
            </h1>

            <p className="body-large mb-10 animate-slide-up max-w-xl text-white/80" style={{ animationDelay: '160ms' }}>
              {t('subheadline')}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row animate-slide-up" style={{ animationDelay: '240ms' }}>
              <Link href="/signup" className={buttonVariants({ size: 'lg', className: 'w-full sm:w-auto px-8' })}>
                {t('ctaPrimary')}
              </Link>
              <Link href="/news" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'w-full sm:w-auto border-white/20 bg-white/5 text-white hover:bg-white hover:text-wire-ink' })}>
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
