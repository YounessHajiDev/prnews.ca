import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'EDITOR')) notFound();

  return <>{children}</>;
}
