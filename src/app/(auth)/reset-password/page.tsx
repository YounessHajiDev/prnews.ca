export const revalidate = 0;

import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function ResetPasswordPage() {
  const session = await auth();
  if (session) redirect('/app');

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <div className="card p-8 max-w-md mx-auto">
          <h1 className="heading-md mb-2">Set New Password</h1>
          <p className="text-wire-muted mb-6">Enter your new password.</p>
          <form className="space-y-4">
            <input type="password" name="password" placeholder="New password" className="w-full rounded-md border border-wire-border px-3 py-2 text-sm" required />
            <input type="password" name="confirmPassword" placeholder="Confirm password" className="w-full rounded-md border border-wire-border px-3 py-2 text-sm" required />
            <button className="w-full rounded-md bg-wire-amber px-4 py-2 text-white">Reset Password</button>
          </form>
        </div>
      </div>
    </section>
  );
}
