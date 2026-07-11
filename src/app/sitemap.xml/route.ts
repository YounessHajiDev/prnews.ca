import { db } from '@/lib/db/prisma';

export const GET = async () => {
  const releases = await db.pressRelease.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 50,
    select: {
      slug: true,
      categorySlug: true,
      publishedAt: true,
    },
  });

  const baseUrl = 'https://prnews.ca';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/en</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  ${releases
    .map((r: any) => `  <url>
    <loc>${baseUrl}/en/news/${r.categorySlug}/${r.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`)
    .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
