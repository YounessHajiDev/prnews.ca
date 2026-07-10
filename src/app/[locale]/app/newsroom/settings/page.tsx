import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

export default async function NewsroomSettingsPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const company = await db.company.findFirst({
    where: { user: { id: session.user.id } },
  });

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">Newsroom Settings</h1>
      <p className="text-wire-muted">Manage your branded newsroom — coming in Phase 2.</p>
    </div>
  );
}
