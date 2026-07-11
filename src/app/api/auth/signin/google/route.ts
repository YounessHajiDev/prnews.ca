import { signIn } from '@/lib/auth/auth';

export async function POST(request: Request) {
  await signIn('google', { redirectTo: '/app' });
}
