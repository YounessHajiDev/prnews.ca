import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const routing = createSharedPathnamesNavigation({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
});
