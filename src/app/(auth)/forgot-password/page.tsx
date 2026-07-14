import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const dynamic = 'force-dynamic';

export default async function ForgotPasswordPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/app');

  const t = await getTranslations('auth.forgotPassword');
  const tc = await getTranslations('common');

  const strings = {
    email: 'Email',
    sendResetLink: t('sendResetLink'),
    sending: tc('loading'),
    resetSent: 'If an account exists, a reset link has been sent.',
  };

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <div className="card p-8 max-w-md mx-auto">
          <h1 className="heading-md mb-2">{t('title')}</h1>
          <p className="text-wire-muted mb-6">{t('subtitle')}</p>

          <ForgotPasswordForm t={strings} />
        </div>
      </div>
    </section>
  );
}
