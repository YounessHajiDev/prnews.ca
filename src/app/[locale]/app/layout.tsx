import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-wire-border bg-wire-surface p-4">
        <h2 className="font-display font-bold mb-6">Dashboard</h2>
        <nav className="space-y-2">
          <a href="/app" className="block py-2 text-sm font-medium text-wire-charcoal">Overview</a>
          <a href="/app/submit" className="block py-2 text-sm text-wire-muted hover:text-wire-charcoal">Submit Release</a>
          <a href="/app/releases" className="block py-2 text-sm text-wire-muted hover:text-wire-charcoal">My Releases</a>
          <a href="/app/newsroom" className="block py-2 text-sm text-wire-muted hover:text-wire-charcoal">Newsroom</a>
          <a href="/app/billing" className="block py-2 text-sm text-wire-muted hover:text-wire-charcoal">Billing</a>
        </nav>
      </aside>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
