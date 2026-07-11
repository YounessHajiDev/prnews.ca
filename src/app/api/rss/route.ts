import { db } from '@/lib/db/prisma';

export const GET = async () => {
  const releases = await db.pressRelease.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 20,
    select: {
      headline: true,
      slug: true,
      categorySlug: true,
      publishedAt: true,
    },
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PR NEWS - Canadian Press Releases</title>
    <link>https://prnews.ca</link>
    <description>Latest Canadian press releases</description>
    ${releases.map((r: any) => `    <item>
      <title>${r.headline}</title>
      <link>https://prnews.ca/en/news/${r.categorySlug}/${r.slug}</link>
      <pubDate>${r.publishedAt.toUTCString()}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml' },
  });
};
