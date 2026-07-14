import { z } from 'zod';
import { db } from '@/lib/db/prisma';
import { slugify } from '@/lib/slugify';
import { sanitizeBody } from '@/lib/sanitize';

const ALLOWED_CATEGORIES = [
  'business', 'technology', 'health', 'finance-economy', 'government-politics',
  'environment', 'consumer-products', 'company-earnings', 'nonprofit-public-interest',
  'sports-entertainment', 'real-estate', 'energy-mining', 'indigenous-affairs',
  'cannabis', 'general',
];

const LANGS = ['en', 'fr', 'both'] as const;

const ReleaseSchema = z.object({
  headline: z.string().min(3, 'Headline must be at least 3 characters').max(200, 'Headline too long'),
  headlineFr: z.string().max(200).optional().or(z.literal('')),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(500, 'Summary too long'),
  body: z.string().min(20, 'Body must be at least 20 characters').max(50000, 'Body too long'),
  bodyFr: z.string().max(50000).optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  language: z.enum(LANGS as any),
  dateline: z.string().max(120).optional().or(z.literal('')),
  keywords: z.array(z.string().max(30)).max(20).default([]),
  embargoAt: z.string().optional().or(z.literal('')),
  mediaContactName: z.string().max(120).optional().or(z.literal('')),
  mediaContactEmail: z.string().email('Invalid contact email').max(255).optional().or(z.literal('')),
  mediaContactPhone: z.string().max(30).optional().or(z.literal('')),
  imageUrls: z.array(z.string().url().max(2048)).max(5).default([]),
  videoUrls: z.array(z.string().url().max(2048)).max(3).default([]),
  pdfUrl: z.string().url().max(2048).optional().or(z.literal('')),
});

export type CreateReleaseInput = z.infer<typeof ReleaseSchema>;

export async function getCreditBalance(userId: string): Promise<number> {
  const result = await db.creditTransaction.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  return result._sum.amount ?? 0;
}

function normalizeCategory(value: string): string {
  const slug = slugify(value);
  return ALLOWED_CATEGORIES.includes(slug) ? slug : 'general';
}

function makeUniqueSlug(headline: string): string {
  const base = slugify(headline);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${Date.now()}-${suffix}`.substring(0, 120);
}

export async function createReleaseForUser(userId: string, formData: unknown) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { company: { select: { id: true } } },
  });

  if (!user?.companyId) {
    return { error: 'You must be associated with a company to submit a release.' };
  }

  const parsed = ReleaseSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join('. ') };
  }

  const data = parsed.data;

  const balance = await getCreditBalance(user.id);
  if (balance <= 0) {
    return { error: 'Insufficient credits. Please purchase a plan or subscribe.' };
  }

  const categorySlug = normalizeCategory(data.category);

  const release = await db.$transaction(async (tx) => {
    const created = await tx.pressRelease.create({
      data: {
        headline: data.headline,
        headlineFr: data.headlineFr || null,
        slug: makeUniqueSlug(data.headline),
        summary: data.summary,
        body: sanitizeBody(data.body),
        bodyFr: data.bodyFr ? sanitizeBody(data.bodyFr) : null,
        status: 'SUBMITTED',
        categorySlug,
        province: data.dateline || null,
        keywords: data.keywords.filter(Boolean),
        language: data.language,
        embargoAt: data.embargoAt ? new Date(data.embargoAt) : null,
        authorId: user.id,
        companyId: user.companyId,
      },
    });

    const mediaAssets = [
      ...data.imageUrls.map((url) => ({ type: 'image', url })),
      ...data.videoUrls.map((url) => ({ type: 'video', url })),
      ...(data.pdfUrl ? [{ type: 'pdf', url: data.pdfUrl }] : []),
    ];

    if (mediaAssets.length > 0) {
      await tx.mediaAsset.createMany({
        data: mediaAssets.map((asset) => ({
          ...asset,
          releaseId: created.id,
        })),
      });
    }

    await tx.creditTransaction.create({
      data: {
        userId: user.id,
        amount: -1,
        type: 'consumption',
      },
    });

    return created;
  });

  return { success: true, releaseId: release.id, release };
}

export async function approveReleaseById(releaseId: string) {
  const release = await db.pressRelease.findUnique({
    where: { id: releaseId },
  });

  if (!release) {
    return { error: 'Release not found' };
  }

  if (release.status === 'PUBLISHED' || release.status === 'DISTRIBUTED') {
    return { error: 'Release is already published' };
  }

  const partners = await db.distributionPartner.findMany({
    where: { status: 'active' },
  });

  await db.$transaction(async (tx) => {
    await tx.pressRelease.update({
      where: { id: releaseId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    for (const partner of partners) {
      await tx.distributionLog.create({
        data: {
          releaseId,
          partnerId: partner.id,
          status: 'delivered',
          deliveredAt: new Date(),
        },
      });
    }
  });

  return { success: true, release };
}

export async function rejectReleaseById(releaseId: string) {
  await db.pressRelease.update({
    where: { id: releaseId },
    data: { status: 'REJECTED' },
  });
  return { success: true };
}

export async function requestChangesForRelease(releaseId: string) {
  await db.pressRelease.update({
    where: { id: releaseId },
    data: { status: 'DRAFT' },
  });
  return { success: true };
}
