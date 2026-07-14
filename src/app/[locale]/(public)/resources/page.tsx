import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface ResourceSection {
  title: string;
  content: string | string[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resources' });
  return { title: t('title') };
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resources' });
  const sections = t.raw('sections') as ResourceSection[];

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <h1 className="heading-lg mb-8">{t('title')}</h1>
        <div className="prose-release">
          <p>{t('intro')}</p>
          {sections.map((section, i) => (
            <div key={i}>
              <h2>{section.title}</h2>
              {Array.isArray(section.content) ? (
                <ul>
                  {section.content.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{section.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
