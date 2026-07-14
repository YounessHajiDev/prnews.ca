import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prnews.ca';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/app', '/admin', '/api', '/login', '/signup', '/forgot-password', '/reset-password'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
