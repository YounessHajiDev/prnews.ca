import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function CallbackPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/app');

  const t = await getTranslations('auth.callback');

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <div className="card p-8 max-w-md mx-auto text-center">
          <h1 className="heading-md mb-2">{t('title')}</h1>
          <p className="text-wire-muted mb-6">{t('subtitle')}</p>
          <form action="/api/auth/signin/google" method="POST">
            <button className="btn-primary w-full">
              {t('signInWithGoogle')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
