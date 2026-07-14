import Link from 'next/link';
import { WireTicker } from '@/components/wire-ticker/wire-ticker';
import { CanadaMap } from '@/components/canada-map/canada-map';
import { CountUp } from '@/components/ui/count-up';
import { buttonVariants } from '@/components/ui/button';

const FEATURES = [
  {
    index: '01',
    title: 'Full Distribution Transparency',
    desc: 'Track every delivery in real-time. Know exactly which outlets picked up your story.',
  },
  {
    index: '02',
    title: 'Fast Turnaround',
    desc: 'Editorial review in under 2 hours. Publish on your schedule.',
  },
  {
    index: '03',
    title: 'Genuinely Bilingual',
    desc: 'Publish in both English and French. Reach every Canadian audience.',
  },
];

const STATS = [
  { label: 'Releases Sent Today', value: 147 },
  { label: 'Media Outlets Reached', value: 2840 },
  { label: 'Active Newsrooms', value: 520 },
];

export default function HomePage() {
  return (
    <>
      <WireTicker />
      <main>
        {/* Hero */}
        <section className="bg-wire-ink py-20 text-white md:py-32 lg:py-40">
          <div className="container-page">
            <div className="max-w-3xl animate-fade-in-up">
              <h1 className="heading-xl mb-6 text-white">
                Press Releases, Distributed Nationwide
              </h1>
              <p className="body-large mb-8 max-w-2xl text-white/80">
                Publish once. Reach every outlet, province, and audience. Real-time delivery confirmation included.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className={buttonVariants({ size: 'lg', className: 'w-full sm:w-auto' })}
                >
                  Get Started
                </Link>
                <Link
                  href="/news"
                  className={buttonVariants({ variant: 'outline', size: 'lg', className: 'w-full sm:w-auto' })}
                >
                  See live releases
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
                <div key={stat.label} className="text-center">
                  <div className="mb-1 font-display text-3xl font-bold text-wire-brass md:text-4xl">
                    <CountUp end={stat.value} />
                  </div>
                  <div className="text-sm uppercase tracking-wider text-wire-slate">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            <CanadaMap />
            <p className="mx-auto mt-6 max-w-xl text-center text-sm text-wire-slate">
              Live distribution nodes pulse as releases reach newsrooms across the country.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="section bg-wire-surface">
          <div className="container-page">
            <h2 className="heading-lg mb-12 text-center">Why PR NEWS?</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {FEATURES.map((feature, i) => (
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
