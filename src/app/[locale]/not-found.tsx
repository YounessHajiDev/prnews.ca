import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function LocaleNotFound() {
  const t = await getTranslations('common');

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow text-center">
        <h1 className="heading-lg mb-4">{t('pageNotFound')}</h1>
        <p className="text-wire-muted mb-6">{t('pageNotFoundDescription')}</p>
        <Link href="/" className="btn-primary">{t('goHome')}</Link>
      </div>
    </section>
  );
}
