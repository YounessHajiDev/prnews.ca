import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function SiteFooter() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-wire-border bg-wire-surface">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display font-semibold mb-4">{t('product')}</h3>
            <ul className="space-y-2">
              <li><Link href="/pricing" className="text-sm text-wire-muted hover:text-wire-charcoal">{t('pricing')}</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-wire-muted hover:text-wire-charcoal">{t('howItWorks')}</Link></li>
              <li><Link href="/news" className="text-sm text-wire-muted hover:text-wire-charcoal">{t('news')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-4">{t('resources')}</h3>
            <ul className="space-y-2">
              <li><Link href="/resources" className="text-sm text-wire-muted hover:text-wire-charcoal">{t('resources')}</Link></li>
              <li><Link href="/journalists" className="text-sm text-wire-muted hover:text-wire-charcoal">{t('journalists')}</Link></li>
              <li><Link href="/contact" className="text-sm text-wire-muted hover:text-wire-charcoal">{t('contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-4">{t('legal')}</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-wire-muted hover:text-wire-charcoal">Terms</Link></li>
              <li><Link href="/privacy" className="text-sm text-wire-muted hover:text-wire-charcoal">Privacy</Link></li>
              <li><Link href="/accessibility-statement" className="text-sm text-wire-muted hover:text-wire-charcoal">Accessibility</Link></li>
              <li><Link href="/casl-compliance" className="text-sm text-wire-muted hover:text-wire-charcoal">CASL</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-4">{t('subscribeNewsletter')}</h3>
            <p className="text-sm text-wire-muted mb-4">Stay updated with the latest in press release distribution.</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-wire-border text-center text-sm text-wire-muted">
          <p>&copy; {new Date().getFullYear()} PR NEWS. {t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
