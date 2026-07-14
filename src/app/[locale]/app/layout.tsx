import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const t = await getTranslations('nav');

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-wire-border bg-wire-surface p-4">
        <div className="mb-6">
          <h2 className="font-display font-bold">{t('dashboard')}</h2>
          <p className="text-xs text-wire-slate truncate" title={session.user.email || ''}>
            {session.user.name || session.user.email}
          </p>
        </div>
        <nav className="space-y-2">
          <a href="/app" className="block py-2 text-sm font-medium text-wire-charcoal">{t('dashboard')}</a>
          <a href="/app/submit" className="block py-2 text-sm text-wire-muted hover:text-wire-charcoal">{t('submitRelease')}</a>
          <a href="/app/releases" className="block py-2 text-sm text-wire-muted hover:text-wire-charcoal">{t('myReleases')}</a>
          <a href="/app/billing" className="block py-2 text-sm text-wire-muted hover:text-wire-charcoal">{t('billing')}</a>
        </nav>
        <form action="/api/auth/signout" method="POST" className="mt-8">
          <Button variant="outline" size="sm" type="submit" className="w-full">
            {t('logout')}
          </Button>
        </form>
      </aside>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
