import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-6xl font-bold text-wire-brass-dark">404</h1>
      <p className="mt-4 text-xl font-semibold text-wire-charcoal">{t('title')}</p>
      <p className="mt-2 text-wire-muted">{t('description')}</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-md bg-wire-charcoal px-6 py-3 text-sm font-medium text-white hover:bg-wire-ink"
      >
        {t('backHome')}
      </Link>
    </main>
  );
}
