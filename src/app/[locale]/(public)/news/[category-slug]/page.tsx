import { ReleaseGrid } from '@/components/news/release-grid';
import { Breadcrumb } from '@/components/layout/breadcrumb';

const RELEASES = [
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
];

export default function CategoryPage() {
  return (
    <section className="section">
      <div className="container-page">
        <Breadcrumb items={[{ label: 'News', href: '/news' }, { label: 'Technology' }]} />
        <h1 className="heading-lg mb-2">Technology</h1>
        <p className="text-wire-muted mb-8">Latest technology press releases from across Canada.</p>
        <ReleaseGrid releases={RELEASES} />
      </div>
    </section>
  );
}
