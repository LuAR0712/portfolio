import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimiter = { limit: (key: string) => Promise<{ success: boolean }> };

export const RATE_LIMIT = { requests: 5, windowMs: 10 * 60 * 1000 } as const;

// Sliding-window log in memory. Used when Upstash isn't configured (local dev, previews).
// On serverless it's per instance, so it only slows abuse down; Upstash makes it global.
export function createMemoryRateLimiter(
  { requests, windowMs }: { requests: number; windowMs: number } = RATE_LIMIT,
  now: () => number = Date.now,
): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    async limit(key) {
      const current = now();
      const recent = (hits.get(key) ?? []).filter((time) => current - time < windowMs);
      const success = recent.length < requests;
      if (success) recent.push(current);
      hits.set(key, recent);
      return { success };
    },
  };
}

export function createUpstashRateLimiter(url: string, token: string): RateLimiter {
  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(RATE_LIMIT.requests, `${RATE_LIMIT.windowMs / 60000} m`),
    prefix: "portfolio:contact",
  });
}
