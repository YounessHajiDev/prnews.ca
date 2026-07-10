import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

export default async function TeamPage() {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">Team</h1>
      <p className="text-wire-muted">Team management — coming in Phase 2.</p>
    </div>
  );
}
