import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('casl');
  return { title: t('title') };
}

export default async function CASLPage() {
  const t = await getTranslations('casl');
  const practices = t.raw('practices') as string[];

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <h1 className="heading-lg mb-8">{t('title')}</h1>
        <div className="prose-release">
          <p>{t('intro')}</p>
          <ul>
            {practices.map((practice, i) => (
              <li key={i}>{practice}</li>
            ))}
          </ul>
          <p>{t('contact')}</p>
        </div>
      </div>
    </section>
  );
}
