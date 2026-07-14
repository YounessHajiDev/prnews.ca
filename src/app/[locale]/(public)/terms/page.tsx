import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface Section {
  title: string;
  content: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });
  return { title: t('title') };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });
  const sections = t.raw('sections') as Section[];

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <h1 className="heading-lg mb-8">{t('title')}</h1>
        <div className="prose-release">
          <p>{t('lastUpdated')}</p>
          <p>{t('intro')}</p>
          {sections.map((section, i) => {
            const paragraphs = section.content.split('\n\n').filter(Boolean);
            return (
              <div key={i}>
                <h2>{section.title}</h2>
                {paragraphs.map((paragraph, j) => (
                  <p key={j}>{paragraph}</p>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
