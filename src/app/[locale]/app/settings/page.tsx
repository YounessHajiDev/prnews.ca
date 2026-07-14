import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const t = await getTranslations('settings');

  return (
    <div className="p-8">
      <h1 className="heading-lg mb-6">{t('title')}</h1>
      <p className="text-wire-muted">{t('comingSoon')}</p>
    </div>
  );
}
