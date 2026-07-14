import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/button';

interface Step {
  step: string;
  title: string;
  desc: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('howItWorks');
  return { title: t('title') };
}

export default async function HowItWorksPage() {
  const t = await getTranslations('howItWorks');
  const tc = await getTranslations('common');
  const steps = t.raw('steps') as Step[];

  return (
    <section className="section bg-wire-paper">
      <div className="container-narrow">
        <p className="dateline mb-3">{t('dateline')}</p>
        <h1 className="heading-lg mb-4">{t('title')}</h1>
        <p className="body-large mb-12 max-w-2xl text-wire-slate">{t('subtitle')}</p>

        <div className="space-y-10">
          {steps.map(({ step, title, desc }) => (
            <div key={step} className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-wire-rule bg-wire-surface font-mono text-xl font-bold text-wire-brass">
                {step}
              </div>
              <div className="pt-1">
                <h2 className="heading-md mb-2">{title}</h2>
                <p className="body-base max-w-xl text-wire-slate">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-wire-rule pt-10 text-center">
          <h2 className="heading-md mb-3">{t('ctaTitle')}</h2>
          <p className="mb-6 text-wire-slate">{t('ctaDescription')}</p>
          <Link href="/signup" className={buttonVariants({ size: 'lg' })}>
            {tc('createAccount')}
          </Link>
        </div>
      </div>
    </section>
  );
}
