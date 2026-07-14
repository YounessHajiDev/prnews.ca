import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

let upstashRatelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  upstashRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    analytics: true,
  });
}

// In-memory fallback for local dev / single-instance deployments
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function getMemoryLimiter(maxRequests: number, windowMs: number) {
  return (identifier: string) => {
    const now = Date.now();
    const record = memoryStore.get(identifier);
    if (!record || now > record.resetAt) {
      memoryStore.set(identifier, { count: 1, resetAt: now + windowMs });
      return { success: true, limit: maxRequests, remaining: maxRequests - 1, reset: now + windowMs };
    }
    if (record.count >= maxRequests) {
      return { success: false, limit: maxRequests, remaining: 0, reset: record.resetAt };
    }
    record.count += 1;
    memoryStore.set(identifier, record);
    return { success: true, limit: maxRequests, remaining: maxRequests - record.count, reset: record.resetAt };
  };
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim() || 'unknown';
  }
  const real = h.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}

export async function rateLimit(
  action: string,
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60_000
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const key = `${action}:${identifier}`;

  if (upstashRatelimit) {
    const { success, limit, remaining, reset } = await upstashRatelimit.limit(key);
    return { success, limit, remaining, reset };
  }

  return getMemoryLimiter(maxRequests, windowMs)(key);
}
