import { z } from 'zod';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { verifyOrigin } from '@/lib/csrf';

const NewsletterSchema = z.object({
  email: z.string().email().max(255).toLowerCase(),
});

export async function POST(request: Request) {
  if (!(await verifyOrigin(request))) {
    return Response.json({ error: 'Invalid origin' }, { status: 403 });
  }

  const ip = await getClientIp();
  const limit = await rateLimit('newsletter', ip, 5, 15 * 60 * 1000);
  if (!limit.success) {
    return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let formData: FormData | null = null;
  let email: string | undefined;

  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const parsed = NewsletterSchema.safeParse(body);
      if (!parsed.success) {
        return Response.json({ error: 'Invalid email address.' }, { status: 400 });
      }
      email = parsed.data.email;
    } else {
      formData = await request.formData();
      const parsed = NewsletterSchema.safeParse(Object.fromEntries(formData.entries()));
      if (!parsed.success) {
        return Response.json({ error: 'Invalid email address.' }, { status: 400 });
      }
      email = parsed.data.email;
    }
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!email) {
    return Response.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  // Upsert subscriber and record consent timestamp
  await db.subscriber.upsert({
    where: { email },
    create: { email },
    update: {},
  });

  // TODO: Send a welcome/double-opt-in email using RESEND_API_KEY

  const redirectTo = request.headers.get('referer') || '/';
  // For browser form posts, redirect back with a success param
  if (!request.headers.get('content-type')?.includes('application/json')) {
    const url = new URL(redirectTo, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    url.searchParams.set('newsletter', 'subscribed');
    return NextResponse.redirect(url.toString(), { status: 303 });
  }

  return Response.json({ success: true });
}
