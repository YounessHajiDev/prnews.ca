import type { Metadata } from 'next';
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { SentryInit } from '@/components/providers/sentry-init';
import { routing } from '@/i18n/routing';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'optional',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'optional',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'optional',
});

export const metadata: Metadata = {
  title: {
    default: 'PR NEWS — Canadian Press Release Distribution',
    template: '%s | PR NEWS',
  },
  description:
    'Modern, transparent press release distribution for the Canadian market. See exactly where your story goes, before you hit send.',
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-wire-paper font-body text-wire-ink antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </NextIntlClientProvider>
        <SentryInit />
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
