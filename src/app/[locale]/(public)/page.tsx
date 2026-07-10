import { WireTicker } from '@/components/wire-ticker/wire-ticker';
import { CanadaMap } from '@/components/canada-map/canada-map';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Languages } from 'lucide-react';

const FEATURES = [
  {
    icon: Shield,
    title: 'Full Distribution Transparency',
    desc: 'Track every delivery in real-time. Know exactly which outlets picked up your story.',
  },
  {
    icon: Zap,
    title: 'Fast Turnaround',
    desc: 'Editorial review in under 2 hours. Publish on your schedule.',
  },
  {
    icon: Languages,
    title: 'Genuinely Bilingual',
    desc: 'Publish in both English and French. Reach every Canadian audience.',
  },
];

const STATS = [
  { label: 'Releases Sent Today', value: '147' },
  { label: 'Media Outlets Reached', value: '2,840' },
  { label: 'Active Newsrooms', value: '520' },
];

const CANADA_PROVINCES = [
  { name: 'British Columbia', count: 42 },
  { name: 'Alberta', count: 31 },
  { name: 'Saskatchewan', count: 8 },
  { name: 'Manitoba', count: 12 },
  { name: 'Ontario', count: 87 },
  { name: 'Quebec', count: 65 },
  { name: 'New Brunswick', count: 9 },
  { name: 'Nova Scotia', count: 11 },
  { name: 'Prince Edward Island', count: 2 },
  { name: 'Newfoundland and Labrador', count: 5 },
  { name: 'Yukon', count: 1 },
  { name: 'Northwest Territories', count: 1 },
  { name: 'Nunavut', count: 0 },
];

export default function HomePage() {
  return (
    <>
      <WireTicker />
      <main>
        {/* Hero */}
        <section className="bg-wire-charcoal text-white py-20 md:py-32">
          <div className="container-page">
            <div className="max-w-3xl">
              <h1 className="heading-xl text-white mb-6">
                Press Releases, Distributed Nationwide
              </h1>
              <p className="body-large text-white/80 mb-8">
                Publish once. Reach every outlet, province, and audience. Real-time delivery confirmation included.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="text-base">Get Started</Button>
                <Button variant="outline" size="lg" className="text-base">
                  See Pricing
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats + Canada Map */}
        <section className="section bg-wire-bg">
          <div className="container-page">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-3xl md:text-4xl font-bold text-wire-amber mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-wire-muted">{stat.label}</div>
                </div>
              ))}
            </div>
            <CanadaMap provinces={CANADA_PROVINCES} />
          </div>
        </section>

        {/* Features */}
        <section className="section bg-wire-surface">
          <div className="container-page">
            <h2 className="heading-lg text-center mb-12">Why PR NEWS?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-lg bg-wire-amber/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-wire-amber" />
                  </div>
                  <h3 className="heading-md mb-3">{feature.title}</h3>
                  <p className="body-base text-wire-muted">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
