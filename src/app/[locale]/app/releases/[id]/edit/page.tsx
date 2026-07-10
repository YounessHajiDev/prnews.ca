import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

export default async function ReleaseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">Edit Release</h1>
      <p className="text-wire-muted">Coming in Phase 2.</p>
    </div>
  );
}
