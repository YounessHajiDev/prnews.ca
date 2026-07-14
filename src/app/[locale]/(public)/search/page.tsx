import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('search');
  return { title: t('title') };
}

export default async function SearchPage() {
  const t = await getTranslations('search');

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <h1 className="heading-lg mb-8">{t('title')}</h1>
        <p className="text-wire-muted mb-8">{t('subtitle')}</p>
        <div className="card p-8 text-center">
          <p className="text-wire-muted">{t('comingSoon')}</p>
        </div>
      </div>
    </section>
  );
}
