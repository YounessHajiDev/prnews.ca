import type { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'PR NEWS — Canadian Press Release Distribution',
    template: '%s | PR NEWS',
  },
  description:
    'Modern, transparent press release distribution for the Canadian market. See exactly where your story goes, before you hit send.',
  robots: 'index, follow',
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-wire-bg font-body text-wire-charcoal antialiased">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
