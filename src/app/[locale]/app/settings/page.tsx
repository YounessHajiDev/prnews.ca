import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">Settings</h1>
      <p className="text-wire-muted">Account settings — coming in Phase 2.</p>
    </div>
  );
}
