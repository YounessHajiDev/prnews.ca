import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

export default async function ReleasesPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const releases = await db.pressRelease.findMany({
    where: { authorId: session.user.id },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  });

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">My Releases</h1>
      {releases.length === 0 ? (
        <p className="text-wire-muted">No releases yet.</p>
      ) : (
        <div className="space-y-4">
          {releases.map((r) => (
            <div key={r.id} className="card p-4 flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold">{r.headline}</h3>
                <p className="text-sm text-wire-muted">
                  {r.publishedAt?.toLocaleDateString()} · {r.status.toLowerCase()}
                </p>
              </div>
              <a href={`/app/releases/${r.id}`} className="text-sm text-wire-amber hover:underline">
                View
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
