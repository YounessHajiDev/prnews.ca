'use client';

import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';

export function LocaleSwitcher() {
  const locale = useLocale();
  const other = locale === 'en' ? 'fr' : 'en';

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-sm font-medium"
      onClick={() => {
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
        const newPath = currentPath.replace(/^\/(en|fr)/, '') || '/';
        window.location.href = `/${other}${newPath}`;
      }}
    >
      {locale === 'en' ? 'FR' : 'EN'}
    </Button>
  );
}
