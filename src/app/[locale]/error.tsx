'use client';

import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-5xl font-bold text-wire-error">{t('title')}</h1>
      <p className="mt-4 text-lg font-semibold text-wire-charcoal">{t('headline')}</p>
      <p className="mt-2 text-wire-muted">{t('description')}</p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center justify-center rounded-md bg-wire-charcoal px-6 py-3 text-sm font-medium text-white hover:bg-wire-ink"
      >
        {t('retry')}
      </button>
    </main>
  );
}
