import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/login');
  if (session.user?.role !== 'ADMIN' && session.user?.role !== 'EDITOR') redirect('/app');

  return <>{children}</>;
}
