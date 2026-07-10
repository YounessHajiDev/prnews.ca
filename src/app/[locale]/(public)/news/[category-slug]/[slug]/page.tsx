import { Breadcrumb } from '@/components/layout/breadcrumb';
import { formatDate } from '@/lib/utils';

// Demo release — replaced by real data in Phase 2
const RELEASE = {
  headline: 'Tech Startup Raises $15M Series A to Expand Canadian AI Solutions',
  summary: 'MAPLE AI INC. — A Toronto-based artificial intelligence startup announced today that it has raised $15 million in Series A funding...',
  body: `<p><strong>TORONTO, ON — July 10, 2026</strong> — MapleAI Inc., a Toronto-based artificial intelligence startup, announced today that it has raised $15 million in Series A funding led by Canadian venture capital firm VentureWest Partners.</p>
<p>The funding round, which also included participation from existing investors, will be used to expand the company's AI-powered solutions for Canadian businesses and accelerate its product development roadmap.</p>
<p>&quot;This investment validates our vision of building world-class AI technology right here in Canada,&quot; said Sarah Chen, CEO and co-founder of MapleAI. &quot;We&rsquo;re excited to scale our team and bring our solutions to more Canadian enterprises.&quot;</p>
<p>Founded in 2023, MapleAI has grown to a team of 35 employees and serves over 100 Canadian clients across finance, healthcare, and retail sectors.</p>`,
  company: 'MapleAI Inc.',
  category: 'Technology',
  province: 'Ontario',
  publishedAt: new Date('2026-07-10'),
  slug: 'tech-startup-raises-15m-series-a',
};

export default function ReleasePage() {
  return (
    <article className="section bg-wire-bg">
      <div className="container-narrow">
        <Breadcrumb items={[
          { label: 'News', href: '/news' },
          { label: 'Technology', href: '/news/technology' },
        ]} />

        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-wire-muted">{formatDate(RELEASE.publishedAt)}</span>
            <span className="text-wire-muted">&middot;</span>
            <span className="text-sm text-wire-muted">{RELEASE.category}</span>
          </div>
          <h1 className="heading-lg mb-4">{RELEASE.headline}</h1>
          <p className="text-lg text-wire-muted">{RELEASE.summary}</p>
        </header>

        <div className="prose-release mb-12">
          <div dangerouslySetInnerHTML={{ __html: RELEASE.body }} />
        </div>

        <footer className="border-t border-wire-border pt-8">
          <div className="text-sm text-wire-muted">
            <strong>Company:</strong> {RELEASE.company} &middot; {RELEASE.province}, Canada
          </div>
        </footer>
      </div>
    </article>
  );
}
