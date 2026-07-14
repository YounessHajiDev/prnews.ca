import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const t = await getTranslations('blog');
  return { title: t('title', { slug: params.slug }) };
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const t = await getTranslations('blog');

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <h1 className="heading-lg mb-8">{t('title', { slug })}</h1>
        <div className="prose-release">
          <p>{t('comingSoon')}</p>
        </div>
      </div>
    </section>
  );
}
