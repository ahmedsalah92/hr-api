import { Injectable } from '@nestjs/common';
import type { RateLimiterPort } from 'src/application/auth/ports/rate-limiter.port';

type Bucket = { hits: number; resetAt: number };

@Injectable()
export class InMemoryRateLimiter implements RateLimiterPort {
  private buckets = new Map<string, Bucket>();
  consume(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const b = this.buckets.get(key);
    if (!b || b.resetAt <= now) {
      const resetAt = now + windowMs;
      this.buckets.set(key, { hits: 1, resetAt });
      return {
        allowed: true,
        remaining: limit - 1,
        resetAt: new Date(resetAt),
      };
    }
    if (b.hits >= limit)
      return { allowed: false, remaining: 0, resetAt: new Date(b.resetAt) };
    b.hits += 1;
    return {
      allowed: true,
      remaining: limit - b.hits,
      resetAt: new Date(b.resetAt),
    };
  }
}
