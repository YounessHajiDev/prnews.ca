export const revalidate = 0;

import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function ForgotPasswordPage() {
  const session = await auth();
  if (session) redirect('/app');

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <div className="card p-8 max-w-md mx-auto">
          <h1 className="heading-md mb-2">Reset Password</h1>
          <p className="text-wire-muted mb-6">Enter your email to receive a reset link.</p>
          <form className="space-y-4">
            <input type="email" name="email" placeholder="you@example.com" className="w-full rounded-md border border-wire-border px-3 py-2 text-sm" required />
            <button className="w-full rounded-md bg-wire-amber px-4 py-2 text-white">Send Reset Link</button>
          </form>
        </div>
      </div>
    </section>
  );
}
