'use server';

import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth/auth';
import { getServerSession } from 'next-auth/next';
import {
  createReleaseForUser,
  approveReleaseById,
  rejectReleaseById,
  requestChangesForRelease,
} from '@/lib/services/releases';
import { getClientIp, rateLimit } from '@/lib/rate-limit';


export type { CreateReleaseInput } from '@/lib/services/releases';

export async function createRelease(formData: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  const ip = getClientIp();
  const limit = await rateLimit('create-release', `${ip}:${session.user.id}`, 20, 60 * 60 * 1000);
  if (!limit.success) {
    return { error: 'Too many submissions. Please try again later.' };
  }

  return createReleaseForUser(session.user.id, formData);
}

export async function approveRelease(releaseId: string) {
  const session = await getServerSession(authOptions);
  if (!['ADMIN', 'EDITOR'].includes(session?.user?.role as string)) {
    return { error: 'Forbidden' };
  }

  const result = await approveReleaseById(releaseId);
  if (result.success && result.release) {
    const release = result.release;
    revalidatePath(`/en/news/${release.categorySlug}/${release.slug}`);
    revalidatePath(`/fr/news/${release.categorySlug}/${release.slug}`);
    revalidatePath(`/en/news/${release.categorySlug}`);
    revalidatePath(`/fr/news/${release.categorySlug}`);
    revalidatePath(`/en/news`);
    revalidatePath(`/fr/news`);
  }
  return result;
}

export async function rejectRelease(releaseId: string) {
  const session = await getServerSession(authOptions);
  if (!['ADMIN', 'EDITOR'].includes(session?.user?.role as string)) {
    return { error: 'Forbidden' };
  }
  return rejectReleaseById(releaseId);
}

export async function requestChanges(releaseId: string) {
  const session = await getServerSession(authOptions);
  if (!['ADMIN', 'EDITOR'].includes(session?.user?.role as string)) {
    return { error: 'Forbidden' };
  }
  return requestChangesForRelease(releaseId);
}
