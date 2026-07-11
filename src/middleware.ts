import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip locale handling for API, static assets, auth handlers, and auth pages
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.startsWith('/(auth)/')
  ) {
    return NextResponse.next();
  }

  // Protect app and admin routes
  const isAppRoute = pathname.match(/^\/(en|fr)?(\/app)?\//);
  const isAdminRoute = pathname.match(/^\/(en|fr)?(\/admin)?\//);
  const session = await getServerSession(authOptions);

  if ((isAppRoute || isAdminRoute) && !session) {
    const url = new URL(`/login`, request.url);
    return NextResponse.redirect(url);
  }

  // Apply locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|llms.txt).*)'],
};
