/**
 * In-memory per-IP rate limit for /api/tutor (TUTOR_DAILY_LIMIT).
 * Location: lib/tutor/rateLimit.ts
 * ponytail: per server instance; upgrade to Redis/KV for multi-instance production.
 */

const buckets = new Map<string, { count: number; resetAt: number }>();

const DAY_MS = 24 * 60 * 60 * 1000;

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function checkRateLimit(
  ip: string,
  limit: number,
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = buckets.get(ip);

  if (!entry || now >= entry.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + DAY_MS });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}

export function getDailyLimit(): number {
  const raw = process.env.TUTOR_DAILY_LIMIT;
  const parsed = raw ? Number.parseInt(raw, 10) : 20;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 20;
}
