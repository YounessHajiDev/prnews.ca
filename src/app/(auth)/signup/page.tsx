import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getTranslations } from 'next-intl/server';

export default async function SignupPage() {
  const t = await getTranslations('auth.signup');

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <div className="card p-8 max-w-md mx-auto">
          <h1 className="heading-md mb-2">{t('title')}</h1>
          <p className="text-wire-muted mb-6">{t('subtitle')}</p>

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">{t('fullName')}</label>
              <Input id="name" type="text" name="name" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">{t('email')}</label>
              <Input id="email" type="email" name="email" placeholder="you@example.com" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">{t('password')}</label>
              <Input id="password" type="password" name="password" required />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-1">{t('companyName')}</label>
              <Input id="company" type="text" name="company" required />
            </div>
            <Button type="submit" className="w-full">{t('createAccount')}</Button>
          </form>

          <p className="text-sm text-wire-muted mt-4 text-center">
            {t('alreadyHaveAccount')}{' '}
            <a href="/login" className="text-wire-amber hover:underline">{t('login')}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
