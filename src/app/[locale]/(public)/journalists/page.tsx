import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('journalists');
  return { title: t('title') };
}

export default async function JournalistsPage() {
  const t = await getTranslations('journalists');
  const benefits = t.raw('benefits') as string[];

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <h1 className="heading-lg mb-8">{t('title')}</h1>
        <div className="prose-release">
          <p>{t('intro')}</p>
          <h2>{t('forJournalists')}</h2>
          <ul>
            {benefits.map((benefit, i) => (
              <li key={i}>{benefit}</li>
            ))}
          </ul>
          <h2>{t('joinTitle')}</h2>
          <p>{t('joinDescription')}</p>
        </div>
      </div>
    </section>
  );
}
