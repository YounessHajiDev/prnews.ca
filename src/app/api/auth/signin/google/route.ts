import { auth, signIn } from '@/lib/auth/auth';

export const POST = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get('callbackUrl') || '/app';

  await signIn('google', { redirectTo: callbackUrl });
};
