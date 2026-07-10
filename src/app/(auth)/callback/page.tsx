import { type Metadata } from 'next';
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

export default async function CallbackPage() {
  const session = await auth();
  if (session) redirect('/app');

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <div className="card p-8 max-w-md mx-auto text-center">
          <h1 className="heading-md mb-2">Authentication</h1>
          <p className="text-wire-muted mb-6">Redirecting...</p>
          <form action="/api/auth/signin/google" method="POST">
            <Button type="submit" className="w-full">
              Sign in with Google
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
