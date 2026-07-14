'use client';

import dynamic from 'next/dynamic';

const SentryClientInit = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? dynamic(() => import('./sentry-client-init').then((m) => m.SentryClientInit), {
      ssr: false,
      loading: () => null,
    })
  : () => null;

export function SentryInit() {
  return <SentryClientInit />;
}
