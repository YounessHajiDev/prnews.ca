import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function AdminQueuePage() {
  const session = await auth();
  if (!session) redirect('/login');
  if (session.user?.role !== 'ADMIN' && session.user?.role !== 'EDITOR') redirect('/app');

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">Release Queue</h1>
      <p className="text-wire-muted">Editorial review queue — coming in Phase 2.</p>
    </div>
  );
}
