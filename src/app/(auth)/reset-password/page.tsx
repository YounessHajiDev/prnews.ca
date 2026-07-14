import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const dynamic = 'force-dynamic';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const session = await getServerSession(authOptions);
  if (session) redirect('/app');

  const token = searchParams.token;
  if (!token) {
    redirect('/forgot-password');
  }

  const t = await getTranslations('auth.resetPassword');
  const tc = await getTranslations('common');

  const strings = {
    newPasswordPlaceholder: t('newPasswordPlaceholder'),
    confirmPasswordPlaceholder: t('confirmPasswordPlaceholder'),
    resetPassword: t('resetPassword'),
    resetting: tc('loading'),
    passwordsDoNotMatch: 'Passwords do not match.',
  };

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <div className="card p-8 max-w-md mx-auto">
          <h1 className="heading-md mb-2">{t('title')}</h1>
          <p className="text-wire-muted mb-6">{t('subtitle')}</p>

          <ResetPasswordForm token={token} t={strings} />
        </div>
      </div>
    </section>
  );
}
