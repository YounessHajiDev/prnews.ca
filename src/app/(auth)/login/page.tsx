import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getTranslations } from 'next-intl/server';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/app');

  const t = await getTranslations('auth.login');

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <div className="card p-8 max-w-md mx-auto">
          <h1 className="heading-md mb-2">{t('title')}</h1>
          <p className="text-wire-muted mb-6">{t('subtitle')}</p>

          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">{t('email')}</label>
              <Input id="email" type="email" name="email" placeholder="you@example.com" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">{t('password')}</label>
              <Input id="password" type="password" name="password" required />
            </div>
            <Button type="submit" className="w-full">{t('logInButton')}</Button>
          </form>

          <div className="mt-6">
            <form action="/api/auth/signin/google" method="POST">
              <Button variant="outline" className="w-full">
                {t('continueWithGoogle')}
              </Button>
            </form>
          </div>

          <p className="text-sm text-wire-muted mt-4 text-center">
            {t('noAccount')}{' '}
            <a href="/signup" className="text-wire-amber hover:underline">{t('signUp')}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
