import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { WireTicker } from '@/components/wire-ticker/wire-ticker';
import { CanadaMap } from '@/components/canada-map/canada-map';
import { CountUp } from '@/components/ui/count-up';
import { buttonVariants } from '@/components/ui/button';

const STATS = [
  { labelKey: 'releasesToday', value: 147 },
  { labelKey: 'outletsReached', value: 2840 },
  { labelKey: 'newsrooms', value: 520 },
];

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('home');
  return {
    title: t('hero.headline'),
  };
}

export default async function HomePage() {
  const t = await getTranslations('home');

  const features = [
    {
      index: '01',
      title: t('features.transparency.title'),
      desc: t('features.transparency.desc'),
    },
    {
      index: '02',
      title: t('features.speed.title'),
      desc: t('features.speed.desc'),
    },
    {
      index: '03',
      title: t('features.bilingual.title'),
      desc: t('features.bilingual.desc'),
    },
  ];

  return (
    <>
      <WireTicker />
      <main>
        {/* Hero */}
        <section className="bg-wire-ink py-20 text-white md:py-32 lg:py-40">
          <div className="container-page">
            <div className="max-w-3xl animate-fade-in-up">
              <h1 className="heading-xl mb-6 text-white">{t('hero.headline')}</h1>
              <p className="body-large mb-8 max-w-2xl text-white/80">{t('hero.subheadline')}</p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className={buttonVariants({ size: 'lg', className: 'w-full sm:w-auto' })}
                >
                  {t('hero.ctaPrimary')}
                </Link>
                <Link
                  href="/news"
                  className={buttonVariants({ variant: 'outline', size: 'lg', className: 'w-full sm:w-auto' })}
                >
                  {t('hero.ctaSecondary')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats + Canada Map */}
        <section className="section bg-wire-paper">
          <div className="container-page">
            <div className="mb-12 grid gap-8 sm:grid-cols-3">
              {STATS.map((stat) => (
                <div key={stat.labelKey} className="text-center">
                  <div className="mb-1 font-display text-3xl font-bold text-wire-brass md:text-4xl">
                    <CountUp end={stat.value} />
                  </div>
                  <div className="text-sm uppercase tracking-wider text-wire-slate">
                    {t(`stats.${stat.labelKey}`)}
                  </div>
                </div>
              ))}
            </div>
            <CanadaMap />
            <p className="mx-auto mt-6 max-w-xl text-center text-sm text-wire-slate">{t('map.caption')}</p>
          </div>
        </section>

        {/* Features */}
        <section className="section bg-wire-surface">
          <div className="container-page">
            <h2 className="heading-lg mb-12 text-center">{t('features.title')}</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="text-center"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="mb-4 font-mono text-4xl font-bold text-wire-brass">
                    {feature.index}
                  </div>
                  <h3 className="heading-md mb-3">{feature.title}</h3>
                  <p className="body-base text-wire-slate">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
