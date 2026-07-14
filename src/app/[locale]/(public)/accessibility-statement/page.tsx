import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface Section {
  title: string;
  content: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('accessibility');
  return { title: t('title') };
}

export default async function AccessibilityPage() {
  const t = await getTranslations('accessibility');
  const sections = t.raw('sections') as Section[];

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <h1 className="heading-lg mb-8">{t('title')}</h1>
        <div className="prose-release">
          <p>{t('intro')}</p>
          {sections.map((section, i) => (
            <div key={i}>
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </div>
          ))}
          <ul>
            <li>{t('email')}</li>
            <li>{t('phone')}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
