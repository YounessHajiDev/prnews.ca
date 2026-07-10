'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { href: '/news', label: 'news' },
  { href: '/pricing', label: 'pricing' },
  { href: '/how-it-works', label: 'howItWorks' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
];

export function SiteHeader() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-wire-border bg-wire-charcoal text-white">
      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold tracking-tight">PR NEWS</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-wire-amber ${
                pathname === link.href || pathname?.startsWith(link.href + '/')
                  ? 'text-wire-amber font-medium'
                  : 'text-white/80'
              }`}
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/fr/" className="text-sm text-white/80 hover:text-wire-amber">
            FR
          </Link>
          <span className="text-white/30">|</span>
          <Link href="/en/" className="text-sm text-white hover:text-wire-amber">
            EN
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-white hover:text-wire-amber hover:bg-transparent">
              {t('login')}
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">{t('signup')}</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-wire-border/20 py-4 px-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-white/80 hover:text-wire-amber"
              onClick={() => setMenuOpen(false)}
            >
              {t(link.label)}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <Link href="/login" className="text-sm text-white/80 hover:text-wire-amber">
              {t('login')}
            </Link>
            <Link href="/signup">
              <Button size="sm">{t('signup')}</Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
