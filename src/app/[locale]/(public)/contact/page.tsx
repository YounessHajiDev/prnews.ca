import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Mail, Phone, MapPin } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('contact');
  return { title: t('title') };
}

export default async function ContactPage() {
  const t = await getTranslations('contact');

  return (
    <section className="section bg-wire-paper">
      <div className="container-narrow">
        <p className="dateline mb-3">{t('dateline')}</p>
        <h1 className="heading-lg mb-8">{t('title')}</h1>

        <p className="body-large mb-10 max-w-2xl text-wire-slate">{t('intro')}</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card p-6">
            <Mail className="mb-4 h-6 w-6 text-wire-brass-dark" />
            <h2 className="heading-sm mb-1">{t('email')}</h2>
            <a
              href="mailto:hello@prnews.ca"
              className="text-wire-ink underline-offset-4 hover:text-wire-brass-dark hover:underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wire-brass focus-visible:ring-offset-2"
            >
              hello@prnews.ca
            </a>
          </div>

          <div className="card p-6">
            <Phone className="mb-4 h-6 w-6 text-wire-brass-dark" />
            <h2 className="heading-sm mb-1">{t('phone')}</h2>
            <span className="font-mono text-wire-slate">1-800-PR-NEWS</span>
          </div>

          <div className="card p-6 sm:col-span-2 lg:col-span-1">
            <MapPin className="mb-4 h-6 w-6 text-wire-brass-dark" />
            <h2 className="heading-sm mb-1">{t('address')}</h2>
            <p className="text-wire-slate">Toronto, Ontario, Canada</p>
          </div>
        </div>
      </div>
    </section>
  );
}
