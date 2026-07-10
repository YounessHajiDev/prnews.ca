import { ReleaseGrid } from '@/components/news/release-grid';

// Demo releases — replaced by real data in Phase 2
const DEMO_RELEASES = [
  {
    id: '1',
    headline: 'Tech Startup Raises $15M Series A to Expand Canadian AI Solutions',
    summary: 'MAPLE AI INC. — A Toronto-based artificial intelligence startup announced today that it has raised $15 million in Series A funding...',
    category: 'Technology',
    province: 'Ontario',
    company: 'MapleAI Inc.',
    publishedAt: new Date('2026-07-10'),
    slug: 'tech-startup-raises-15m-series-a',
  },
  {
    id: '2',
    headline: 'BC Mining Company Announces New Sustainable Operations',
    summary: 'VANCOUVER, BC — Pacific Minerals Corp., a leading British Columbia mining company, announced today a $50 million investment...',
    category: 'Mining',
    province: 'British Columbia',
    company: 'Pacific Minerals Corp.',
    publishedAt: new Date('2026-07-10'),
    slug: 'bc-mining-company-sustainable-operations',
  },
  {
    id: '3',
    headline: 'Quebec Healthcare Provider Launches Telemedicine Platform',
    summary: 'MONTREAL, QC — SantéNumérique, a Quebec-based healthcare technology company, unveiled its new telemedicine platform...',
    category: 'Health',
    province: 'Quebec',
    company: 'SantéNumérique',
    publishedAt: new Date('2026-07-09'),
    slug: 'quebec-healthcare-telemedicine-platform',
  },
  {
    id: '4',
    headline: 'Alberta Oil Sands Operator Invests $50M in Green Technology',
    summary: 'CALGARY, AB — Northern Energy Solutions, an Alberta-based oil sands operator, announced a $50 million investment...',
    category: 'Energy',
    province: 'Alberta',
    company: 'Northern Energy Solutions',
    publishedAt: new Date('2026-07-09'),
    slug: 'alberta-oil-sands-green-technology',
  },
  {
    id: '5',
    headline: 'Toronto Real Estate Market Shows Strong Q2 Recovery',
    summary: 'TORONTO, ON — The Greater Toronto Area real estate market showed signs of a strong recovery in the second quarter...',
    category: 'Real Estate',
    province: 'Ontario',
    company: 'Urban Capital Realty',
    publishedAt: new Date('2026-07-08'),
    slug: 'toronto-real-estate-q2-recovery',
  },
  {
    id: '6',
    headline: 'Canadian Cannabis Producer Expands Distribution Network',
    summary: 'WINNIPEG, MB — Prairie Cannabis Co. announced today an expansion of its distribution network across Western Canada...',
    category: 'Cannabis',
    province: 'Manitoba',
    company: 'Prairie Cannabis Co.',
    publishedAt: new Date('2026-07-07'),
    slug: 'canadian-cannabis-producer-expansion',
  },
];

export default function NewsPage() {
  return (
    <section className="section">
      <div className="container-page">
        <h1 className="heading-lg mb-2">News</h1>
        <p className="text-wire-muted mb-8">Latest press releases from companies across Canada.</p>
        <ReleaseGrid releases={DEMO_RELEASES} />
      </div>
    </section>
  );
}
