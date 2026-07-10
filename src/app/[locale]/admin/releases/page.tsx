import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

export default async function AdminReleasesPage() {
  const session = await auth();
  if (!session) redirect('/login');
  if (session.user?.role !== 'ADMIN') redirect('/app');

  const releases = await db.pressRelease.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 50,
    include: {
      company: true,
      author: { select: { email: true } },
    },
  });

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">All Releases</h1>
      <p className="text-wire-muted mb-6">
        {releases.length} releases in system.
      </p>
      <p className="text-wire-muted">All releases management — coming in Phase 2.</p>
    </div>
  );
}
