import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

export default async function AdminDistributionPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user?.role !== 'ADMIN') redirect('/app');

  const partners = await db.distributionPartner.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">Distribution Partners</h1>
      <p className="text-wire-muted mb-6">
        {partners.length} registered distribution partners.
      </p>
      <p className="text-wire-muted">Coming in Phase 2.</p>
    </div>
  );
}
