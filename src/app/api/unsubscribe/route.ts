import { z } from 'zod';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

const TokenSchema = z.string().min(10);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token') || '';

  const parsed = TokenSchema.safeParse(token);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid unsubscribe link.' }, { status: 400 });
  }

  const subscriber = await db.subscriber.findUnique({ where: { token } });

  if (!subscriber) {
    return Response.json({ error: 'Invalid unsubscribe link.' }, { status: 404 });
  }

  await db.$transaction(async (tx) => {
    await tx.subscriber.update({
      where: { id: subscriber.id },
      data: { unsubscribedAt: new Date() },
    });

    // If a registered user has the same email, mark their account as unsubscribed too
    const user = await tx.user.findUnique({ where: { email: subscriber.email } });
    if (user && !user.unsubscribedAt) {
      await tx.user.update({
        where: { id: user.id },
        data: { unsubscribedAt: new Date() },
      });
    }
  });

  const url = new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
  url.searchParams.set('unsubscribed', 'true');
  return NextResponse.redirect(url.toString(), { status: 302 });
}
