import { Quote } from 'lucide-react';

export const metadata = { title: 'About — PR NEWS' };

export default function AboutPage() {
  return (
    <section className="section bg-wire-paper">
      <div className="container-narrow">
        <p className="dateline mb-3">TORONTO, ON — EST. 2026</p>
        <h1 className="heading-lg mb-8">About PR NEWS</h1>

        <div className="prose-release">
          <p className="body-large">
            PR NEWS is a Canadian press release distribution platform designed for the modern era. We believe that every Canadian business deserves access to transparent, affordable, and effective press release distribution — regardless of size or budget.
          </p>
          <p>
            Founded in 2026, PR NEWS was built in response to the limitations of legacy newswire services. We saw companies paying thousands for opaque distribution processes with no visibility into where their stories actually went.
          </p>

          <figure className="my-10 border-l-4 border-wire-brass bg-wire-surface p-6 md:p-8">
            <Quote className="mb-3 h-6 w-6 text-wire-brass" />
            <blockquote className="border-none p-0 not-italic">
              <p className="font-display text-xl font-semibold leading-relaxed text-wire-ink md:text-2xl">
                Make press release distribution transparent, fast, and accessible to every Canadian business.
              </p>
            </blockquote>
            <figcaption className="mt-4 font-mono text-xs uppercase tracking-wider text-wire-slate">
              — PR NEWS mission
            </figcaption>
          </figure>

          <p>
            Our mission is simple: make press release distribution transparent, fast, and accessible to every Canadian business. From startups in Vancouver to non-profits in Halifax, we help stories find their audience.
          </p>
        </div>
      </div>
    </section>
  );
}
