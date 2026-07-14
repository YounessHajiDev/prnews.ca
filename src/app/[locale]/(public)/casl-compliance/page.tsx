import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'casl' });
  return { title: t('title') };
}

export default async function CASLPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'casl' });
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
