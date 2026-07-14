'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export function SentryClientInit() {
  useEffect(() => {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!dsn) return;

    Sentry.init({
      dsn,
      environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: process.env.NEXT_PUBLIC_SENTRY_DEBUG === 'true',
      beforeSend(event) {
        if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_SENTRY_DEBUG) {
          return null;
        }
        return event;
      },
    });
  }, []);

  return null;
}
