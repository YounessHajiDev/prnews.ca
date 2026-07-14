import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { WireTicker } from '@/components/wire-ticker/wire-ticker';
import { CountUp } from '@/components/ui/count-up';
import { LazyCanadaMap } from '@/components/canada-map/lazy-canada-map';
import { Hero } from '@/components/home/hero';
import { TrustBar } from '@/components/home/trust-bar';
import { FeatureGrid } from '@/components/home/feature-grid';
import { HowItWorksShort } from '@/components/home/how-it-works-short';
import { Testimonials } from '@/components/home/testimonials';
import { FinalCta } from '@/components/home/final-cta';

const STATS = [
  { labelKey: 'releasesToday', value: 147 },
  { labelKey: 'outletsReached', value: 2840 },
  { labelKey: 'newsrooms', value: 520 },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: t('hero.headline'),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <>
      <WireTicker />
      <main>
        <Hero />

        <TrustBar />

        {/* Stats + Canada Map */}
        <section className="section bg-wire-paper">
          <div className="container-page">
            <div className="mb-12 grid gap-8 sm:grid-cols-3">
              {STATS.map((stat) => (
                <div key={stat.labelKey} className="text-center">
                  <div className="mb-1 font-display text-3xl font-bold text-wire-brass-dark md:text-4xl">
                    <CountUp end={stat.value} />
                  </div>
                  <div className="text-sm uppercase tracking-wider text-wire-slate">
                    {t(`stats.${stat.labelKey}`)}
                  </div>
                </div>
              ))}
            </div>
            <LazyCanadaMap />
            <p className="mx-auto mt-6 max-w-xl text-center text-sm text-wire-slate">{t('map.caption')}</p>
            <p className="mx-auto mt-2 max-w-xl text-center text-xs text-wire-slate">{t('map.credit')}</p>
          </div>
        </section>

        <FeatureGrid />

        <HowItWorksShort />

        <Testimonials />

        <FinalCta />
      </main>
    </>
  );
}
