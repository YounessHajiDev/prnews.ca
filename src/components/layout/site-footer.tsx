'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SiteFooter() {
  const t = useTranslations();

  return (
    <footer className="border-t border-wire-rule bg-wire-ink text-wire-paper">
      <div className="container-page py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="font-display text-xl font-bold text-white">
              PR NEWS
            </Link>
            <p className="mt-4 max-w-xs text-sm text-wire-paper/70">
              {t('site.description')}
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-wire-brass">
              {t('footer.product')}
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-sm text-wire-paper/70 transition-colors hover:text-white">
                  {t('nav.pricing')}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-wire-paper/70 transition-colors hover:text-white">
                  {t('nav.howItWorks')}
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-sm text-wire-paper/70 transition-colors hover:text-white">
                  {t('nav.news')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-wire-brass">
              {t('footer.resources')}
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/resources" className="text-sm text-wire-paper/70 transition-colors hover:text-white">
                  {t('nav.resources')}
                </Link>
              </li>
              <li>
                <Link href="/journalists" className="text-sm text-wire-paper/70 transition-colors hover:text-white">
                  {t('nav.journalists')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-wire-paper/70 transition-colors hover:text-white">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-wire-brass">
              {t('footer.legal')}
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-wire-paper/70 transition-colors hover:text-white">
                  {t('terms.title')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-wire-paper/70 transition-colors hover:text-white">
                  {t('privacy.title')}
                </Link>
              </li>
              <li>
                <Link href="/accessibility-statement" className="text-sm text-wire-paper/70 transition-colors hover:text-white">
                  {t('accessibility.title')}
                </Link>
              </li>
              <li>
                <Link href="/casl-compliance" className="text-sm text-wire-paper/70 transition-colors hover:text-white">
                  {t('casl.title')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-2 md:items-center">
          <p className="text-center text-sm text-wire-paper/70 md:text-left">
            &copy; {new Date().getFullYear()} PR NEWS. {t('footer.copyright')}
          </p>
          <form
            action="/api/newsletter"
            method="post"
            className="flex flex-col gap-2 sm:flex-row"
          >
            <label htmlFor="footer-email" className="sr-only">
              {t('footer.subscribeNewsletter')}
            </label>
            <Input
              id="footer-email"
              type="email"
              name="email"
              placeholder={t('common.emailPlaceholder')}
              className="flex-1 border-white/10 bg-white/5 text-white placeholder:text-wire-paper/50"
            />
            <Button type="submit" size="sm" className="shrink-0">
              {t('common.subscribe')}
            </Button>
          </form>
        </div>
      </div>
    </footer>
  );
}
