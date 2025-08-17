export interface RateLimiterPort {
  consume(
    key: string,
    limit: number,
    windowMs: number,
  ): {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
  };
}
