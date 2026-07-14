import { headers, cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

async function getLocaleFromHeaders(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  if (cookieLocale && routing.locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  const headersStore = await headers();
  const acceptLang = headersStore.get('accept-language');
  if (acceptLang) {
    const primary = acceptLang.split(',')[0].split('-')[0];
    if (routing.locales.includes(primary)) {
      return primary;
    }
  }

  return undefined;
}

export default getRequestConfig(async ({ requestLocale }: { requestLocale?: Promise<string | undefined> }) => {
  const resolvedLocale = await requestLocale;
  const locale = resolvedLocale ?? (await getLocaleFromHeaders()) ?? routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
