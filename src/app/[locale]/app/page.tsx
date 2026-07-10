import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function AppHomePage() {
  const session = await auth();
  if (!session) redirect('/login');
  redirect('/app/dashboard');
}
