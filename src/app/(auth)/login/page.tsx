import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect('/app');

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <div className="card p-8 max-w-md mx-auto">
          <h1 className="heading-md mb-2">Log in</h1>
          <p className="text-wire-muted mb-6">Access your PR NEWS account.</p>

          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <Input id="email" type="email" name="email" placeholder="you@example.com" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <Input id="password" type="password" name="password" required />
            </div>
            <Button type="submit" className="w-full">Log in</Button>
          </form>

          <div className="mt-6">
            <form action="/api/auth/signin/google" method="POST">
              <Button variant="outline" className="w-full">
                Continue with Google
              </Button>
            </form>
          </div>

          <p className="text-sm text-wire-muted mt-4 text-center">
            Don't have an account?{' '}
            <a href="/signup" className="text-wire-amber hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </section>
  );
}
