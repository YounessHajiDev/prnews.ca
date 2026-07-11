import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';

export const routing = createLocalizedPathnamesNavigation({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
});
