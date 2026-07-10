import { db } from '../../src/lib/db/prisma';

async function main() {
  console.log('Seeding database...');

  // Create sample company
  const company = await db.company.create({
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
  });

  // Create sample user
  const user = await db.user.create({
    data: {
      email: 'demo@prnews.ca',
      name: 'Demo User',
      role: 'CLIENT',
      company: { connect: { id: company.id } },
    },
  });

  // Create sample distribution partners
  const partners = await Promise.all([
    db.distributionPartner.create({ data: { name: 'Canadian Press', slug: 'canadian-press', type: 'news-aggregator', status: 'active' } }),
    db.distributionPartner.create({ data: { name: 'CBC News', slug: 'cbc', type: 'media-outlet', status: 'active' } }),
    db.distributionPartner.create({ data: { name: 'CTV News', slug: 'ctv', type: 'media-outlet', status: 'active' } }),
    db.distributionPartner.create({ data: { name: 'Global News', slug: 'global', type: 'media-outlet', status: 'active' } }),
    db.distributionPartner.create({ data: { name: 'RSS Feed', slug: 'rss', type: 'rss-syndicate', status: 'active' } }),
  ]);

  console.log('Seed complete!');
  console.log({ company, user, partners });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await db.$disconnect());
