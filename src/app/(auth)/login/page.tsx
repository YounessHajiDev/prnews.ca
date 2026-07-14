import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { LoginForm } from '@/components/auth/login-form';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/app');

  const t = await getTranslations('auth.login');
  const tc = await getTranslations('common');

  const strings = {
    email: t('email'),
    password: t('password'),
    logInButton: t('logInButton'),
    invalidCredentials: 'Invalid email or password.',
    loggingIn: tc('loading'),
  };

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <div className="card p-8 max-w-md mx-auto">
          <h1 className="heading-md mb-2">{t('title')}</h1>
          <p className="text-wire-muted mb-6">{t('subtitle')}</p>

          <LoginForm t={strings} />

          <div className="mt-6 flex items-center justify-between text-sm">
            <a href="/forgot-password" className="text-wire-amber hover:underline">
              {t('forgotPassword')}
            </a>
            <span className="text-wire-muted">
              {t('noAccount')}{' '}
              <a href="/signup" className="text-wire-amber hover:underline">
                {t('signUp')}
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
