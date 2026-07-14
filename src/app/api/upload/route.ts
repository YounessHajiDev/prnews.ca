import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { verifyOrigin } from '@/lib/csrf';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES: Record<string, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  pdf: ['application/pdf'],
  video: ['video/mp4', 'video/quicktime', 'video/webm'],
};

function extensionForMime(type: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'application/pdf': '.pdf',
    'video/mp4': '.mp4',
    'video/quicktime': '.mov',
    'video/webm': '.webm',
  };
  return map[type] || '';
}

function sanitizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 120);
}

export async function POST(request: Request) {
  if (!(await verifyOrigin(request))) {
    return Response.json({ error: 'Invalid origin' }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = await getClientIp();
  const limit = await rateLimit('upload', `${ip}:${session.user.id}`, 20, 60 * 1000);
  if (!limit.success) {
    return Response.json({ error: 'Too many uploads. Please try again later.' }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return Response.json({ error: 'No file provided' }, { status: 400 });
  }

  const type = file.type || 'application/octet-stream';
  const allowedType = Object.keys(ALLOWED_TYPES).find((key) =>
    ALLOWED_TYPES[key].includes(type)
  );
  if (!allowedType) {
    return Response.json({ error: 'Unsupported file type' }, { status: 415 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: 'File too large. Max 10 MB.' }, { status: 413 });
  }

  const safeBase = sanitizeName(file.name.replace(/\.[^.]+$/, '')) || 'upload';
  const ext = extensionForMime(type);
  const filename = `${safeBase}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, file, { access: 'public' });
      return Response.json({ url: blob.url, type: allowedType });
    }

    // Local fallback for development
    if (process.env.NODE_ENV !== 'production') {
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
      return Response.json({ url: `${siteUrl}/uploads/${filename}`, type: allowedType });
    }

    return Response.json({ error: 'File storage is not configured' }, { status: 503 });
  } catch (err: any) {
    console.error('Upload error:', err);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}
