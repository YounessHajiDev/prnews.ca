import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/prisma';
import { redirect, notFound } from 'next/navigation';

export default async function AdminHomePage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') notFound();
  redirect('/admin/queue');
}
