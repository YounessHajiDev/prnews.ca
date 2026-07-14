import { db } from '@/lib/db/prisma';
import { hash } from 'bcryptjs';

const TEST_PASSWORD = 'TestPass123!';

async function main() {
  console.log('Seeding database...');

  const passwordHash = await hash(TEST_PASSWORD, 12);

  const companies = await Promise.all([
    db.company.create({
      data: {
        name: 'MapleAI Inc.',
        slug: 'mapleai',
        website: 'https://mapleai.ca',
        industry: 'Technology',
        city: 'Toronto',
        province: 'Ontario',
        country: 'CA',
        bio: 'MapleAI builds AI-powered solutions for Canadian businesses.',
      },
    }),
    db.company.create({
      data: {
        name: 'Loon Logic Ltd.',
        slug: 'loonlogic',
        website: 'https://loonlogic.ca',
        industry: 'Finance',
        city: 'Vancouver',
        province: 'British Columbia',
        country: 'CA',
        bio: 'Loon Logic provides Canadian fintech analytics.',
      },
    }),
  ]);

  const [admin, editor, clientA, clientB] = await Promise.all([
    db.user.create({
      data: {
        email: 'admin@prnews.ca',
        name: 'Admin User',
        passwordHash,
        role: 'ADMIN',
      },
    }),
    db.user.create({
      data: {
        email: 'editor@prnews.ca',
        name: 'Editor User',
        passwordHash,
        role: 'EDITOR',
      },
    }),
    db.user.create({
      data: {
        email: 'client@prnews.ca',
        name: 'Demo Client',
        passwordHash,
        role: 'CLIENT',
        companyId: companies[0].id,
      },
    }),
    db.user.create({
      data: {
        email: 'client2@prnews.ca',
        name: 'Other Client',
        passwordHash,
        role: 'CLIENT',
        companyId: companies[1].id,
      },
    }),
  ]);

  await db.creditTransaction.createMany({
    data: [
      { userId: clientA.id, amount: 10, type: 'purchase' },
      { userId: clientB.id, amount: 10, type: 'purchase' },
    ],
  });

  const partners = await Promise.all([
    db.distributionPartner.create({ data: { name: 'Canadian Press', slug: 'canadian-press', type: 'news-aggregator', status: 'active' } }),
    db.distributionPartner.create({ data: { name: 'CBC News', slug: 'cbc', type: 'media-outlet', status: 'active' } }),
    db.distributionPartner.create({ data: { name: 'CTV News', slug: 'ctv', type: 'media-outlet', status: 'active' } }),
    db.distributionPartner.create({ data: { name: 'Global News', slug: 'global', type: 'media-outlet', status: 'active' } }),
    db.distributionPartner.create({ data: { name: 'RSS Feed', slug: 'rss', type: 'rss-syndicate', status: 'active' } }),
  ]);

  // Seed one published bilingual release to verify public pages immediately
  const publishedRelease = await db.pressRelease.create({
    data: {
      headline: 'MapleAI annonce une expansion pancanadienne',
      headlineFr: 'MapleAI annonce une expansion pancanadienne',
      slug: 'mapleai-annonce-expansion-pancanadienne',
      summary: 'MapleAI is expanding its operations across Canada.',
      body: '<p>MapleAI today announced a major expansion to serve customers in every province.</p>',
      bodyFr: '<p>MapleAI annonce aujourd\'hui une expansion majeure.</p>',
      status: 'PUBLISHED',
      categorySlug: 'business',
      province: 'Ontario',
      keywords: ['AI', 'Canada', 'expansion'],
      language: 'both',
      publishedAt: new Date(),
      authorId: clientA.id,
      companyId: companies[0].id,
    },
  });

  await db.distributionLog.createMany({
    data: partners.map((p) => ({
      status: 'delivered',
      partnerId: p.id,
      releaseId: publishedRelease.id,
      deliveredAt: new Date(),
    })),
  });

  console.log('Seed complete!');
  console.log({ admin, editor, clientA, clientB, companies, partners, publishedRelease });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await db.$disconnect());
