import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

export default async function AdminHomePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user?.role !== 'ADMIN') redirect('/app');
  redirect('/admin/queue');
}
