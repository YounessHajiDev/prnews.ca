'use server';

import { hash } from 'bcryptjs';
import { db } from '@/lib/db/prisma';
import { slugify } from '@/lib/slugify';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const SignUpSchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  email: z.string().email('Invalid email').max(255).toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  company: z.string().min(2, 'Company name is required').max(120),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;

export async function signUp(formData: unknown) {
  const ip = await getClientIp();
  const limit = await rateLimit('signup', ip, 5, 60 * 60 * 1000);
  if (!limit.success) {
    return { error: 'Too many signup attempts. Please try again later.' };
  }

  const parsed = SignUpSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join('. ') };
  }

  const { name, email, password, company } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: 'An account with this email already exists.' };
  }

  const passwordHash = await hash(password, 12);

  let companyRecord;
  try {
    companyRecord = await db.company.create({
      data: {
        name: company,
        slug: slugify(company),
        country: 'CA',
      },
    });
  } catch (e: any) {
    if (e.code === 'P2002') {
      return { error: 'A company with this name already exists.' };
    }
    throw e;
  }

  await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'CLIENT',
      companyId: companyRecord.id,
    },
  });

  return { success: true };
}

const ForgotPasswordSchema = z.object({
  email: z.string().email().max(255).toLowerCase(),
});

export async function requestPasswordReset(formData: unknown) {
  const ip = await getClientIp();
  const limit = await rateLimit('password-reset', ip, 5, 60 * 60 * 1000);
  if (!limit.success) {
    return { error: 'Too many password reset attempts. Please try again later.' };
  }

  const parsed = ForgotPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: 'Invalid email address.' };
  }

  const { email } = parsed.data;
  const user = await db.user.findUnique({ where: { email } });

  if (user) {
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await db.user.update({
      where: { id: user.id },
      data: { passwordResetToken: token, passwordResetExpires: expires },
    });

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'noreply@prnews.ca',
        to: email,
        subject: 'Reset your PR NEWS password',
        html: `<p>Click <a href="${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}">here</a> to reset your password. This link expires in one hour.</p>`,
      });
    } else {
      console.log(`[dev] password reset token for ${email}: ${token}`);
    }
  }

  // Always return generic success to avoid email enumeration
  return { success: true };
}

const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
});

export async function resetPassword(formData: unknown) {
  const parsed = ResetPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: 'Invalid request.' };
  }

  const { token, password } = parsed.data;

  const user = await db.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return { error: 'Invalid or expired reset token.' };
  }

  const passwordHash = await hash(password, 12);

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  return { success: true };
}
