import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function CallbackPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/app');

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <div className="card p-8 max-w-md mx-auto text-center">
          <h1 className="heading-md mb-2">Authentication</h1>
          <p className="text-wire-muted mb-6">Redirecting...</p>
          <form action="/api/auth/signin/google" method="POST">
            <button className="btn-primary w-full">
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
