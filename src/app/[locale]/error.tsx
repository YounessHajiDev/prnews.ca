'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ErrorBoundary({
  error,
}: {
  error: Error;
}) {
  const t = useTranslations('common');

  return (
    <div className="min-h-screen flex items-center justify-center bg-wire-bg">
      <div className="text-center">
        <h1 className="heading-lg mb-4">{t('somethingWentWrong')}</h1>
        <p className="text-wire-muted mb-6">{t('refresh')}</p>
        <Link href="/" className="btn-primary">{t('goHome')}</Link>
      </div>
    </div>
  );
}
