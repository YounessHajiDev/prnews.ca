import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session) redirect('/login');
  if (session.user?.role !== 'ADMIN') redirect('/app');

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">Platform Analytics</h1>
      <p className="text-wire-muted">Coming in Phase 4.</p>
    </div>
  );
}
