import { headers } from 'next/headers';

export function verifyOrigin(request?: Request): boolean {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://prnews.ca').replace(/\/$/, '');

  if (request) {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    if (origin) return origin === siteUrl;
    if (referer) return referer.startsWith(`${siteUrl}/`);
    // Non-browser clients (e.g. curl) may omit origin; allow in dev but require origin in production
    return process.env.NODE_ENV !== 'production';
  }

  const h = headers();
  const origin = h.get('origin');
  const referer = h.get('referer');
  if (origin) return origin === siteUrl;
  if (referer) return referer.startsWith(`${siteUrl}/`);
  return process.env.NODE_ENV !== 'production';
}
