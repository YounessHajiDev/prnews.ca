import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: 'always',
});

const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/callback'];

function isProtectedPath(pathname: string): { app: boolean; admin: boolean } {
  const m = pathname.match(/^\/(en|fr)\/(app|admin)(?:\/|$)/);
  if (!m) return { app: false, admin: false };
  return { app: m[2] === 'app', admin: m[2] === 'admin' };
}

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
    authPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))
  ) {
    return NextResponse.next();
  }

  // Auth wall for /app and /admin before rendering
  const protectedPath = isProtectedPath(pathname);
  if (protectedPath.app || protectedPath.admin) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.email) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (protectedPath.admin && !['ADMIN', 'EDITOR'].includes(token.role as string)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Apply locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|llms.txt|robots.txt).*)'],
};
