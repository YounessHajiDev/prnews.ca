import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { SignupForm } from '@/components/auth/signup-form';

export const dynamic = 'force-dynamic';

export default async function SignupPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/app');

  const t = await getTranslations('auth.signup');
  const tc = await getTranslations('common');

  const strings = {
    fullName: t('fullName'),
    companyName: t('companyName'),
    email: t('email'),
    password: t('password'),
    createAccount: t('createAccount'),
    creatingAccount: tc('loading'),
  };

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <div className="card p-8 max-w-md mx-auto">
          <h1 className="heading-md mb-2">{t('title')}</h1>
          <p className="text-wire-muted mb-6">{t('subtitle')}</p>

          <SignupForm t={strings} />

          <p className="text-sm text-wire-muted mt-4 text-center">
            {t('alreadyHaveAccount')}{' '}
            <a href="/login" className="text-wire-amber hover:underline">
              {t('login')}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
