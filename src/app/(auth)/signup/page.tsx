import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <div className="card p-8 max-w-md mx-auto">
          <h1 className="heading-md mb-2">Create your account</h1>
          <p className="text-wire-muted mb-6">Start distributing press releases today.</p>

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Full name</label>
              <Input id="name" type="text" name="name" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <Input id="email" type="email" name="email" placeholder="you@example.com" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <Input id="password" type="password" name="password" required />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-1">Company name</label>
              <Input id="company" type="text" name="company" required />
            </div>
            <Button type="submit" className="w-full">Create account</Button>
          </form>

          <p className="text-sm text-wire-muted mt-4 text-center">
            Already have an account?{' '}
            <a href="/login" className="text-wire-amber hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </section>
  );
}
