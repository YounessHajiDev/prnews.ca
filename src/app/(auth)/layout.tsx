import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Auth | PR NEWS',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-wire-bg font-body text-wire-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
