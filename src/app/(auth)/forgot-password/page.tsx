export const revalidate = 0;

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function ForgotPasswordPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/app');

  const t = await getTranslations('auth.forgotPassword');

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <div className="card p-8 max-w-md mx-auto">
          <h1 className="heading-md mb-2">{t('title')}</h1>
          <p className="text-wire-muted mb-6">{t('subtitle')}</p>
          <form className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder={t('emailPlaceholder')}
              className="w-full rounded-md border border-wire-border px-3 py-2 text-sm"
              required
            />
            <button className="w-full rounded-md bg-wire-amber px-4 py-2 text-white">
              {t('sendResetLink')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
