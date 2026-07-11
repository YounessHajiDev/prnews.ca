import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

export default async function SubmitPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const drafts = await db.pressRelease.findMany({
    where: { authorId: session.user.id, status: 'DRAFT' },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">Submit a Release</h1>
      {drafts.length > 0 && (
        <div className="card p-4 mb-6">
          <h2 className="text-sm font-medium mb-2">Draft Releases</h2>
          {drafts.map((r: any) => (
            <div key={r.id} className="flex items-center justify-between py-2 border-b border-wire-border last:border-0">
              <span className="text-sm">{r.headline}</span>
              <span className="text-xs text-wire-muted">{r.createdAt.toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-wire-muted">Release submission wizard — coming in Phase 2.</p>
    </div>
  );
}
