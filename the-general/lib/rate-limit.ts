const attempts = new Map<string, { count: number; resetAt: number }>();

/**
 * In-memory fixed-window rate limiter. Good enough for a single-instance
 * deployment; swap for a Redis/Upstash-backed limiter if this app ever runs
 * on multiple instances.
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count };
}
