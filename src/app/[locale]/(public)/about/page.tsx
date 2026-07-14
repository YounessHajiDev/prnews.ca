import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about');
  return { title: t('title') };
}

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <section className="section bg-wire-surface">
      <div className="container-narrow">
        <p className="dateline mb-4">{t('dateline')}</p>
        <h1 className="heading-lg mb-8">{t('title')}</h1>

        <div className="prose-release">
          <p className="lead">{t('intro')}</p>

          <figure className="my-10 border-l-4 border-wire-brass pl-6">
            <blockquote className="heading-md mb-2">{t('mission')}</blockquote>
            <figcaption className="text-sm text-wire-slate">{t('missionCaption')}</figcaption>
          </figure>

          <p>{t('closing')}</p>
        </div>
      </div>
    </section>
  );
}
