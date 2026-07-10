import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function AdminReleasesPage() {
  const session = await auth();
  if (!session) redirect('/login');
  if (session.user?.role !== 'ADMIN') redirect('/app');

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">All Releases</h1>
      <p className="text-wire-muted">All releases management — coming in Phase 2.</p>
    </div>
  );
}
