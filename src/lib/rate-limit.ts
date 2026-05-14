import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Upstash Redis is configured
const isRedisConfigured = () => {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
};

// Create a rate limiter with Upstash Redis
// 100 requests per 15 minutes sliding window
export const rateLimiter = isRedisConfigured()
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(100, "900 s"),
      timeout: 1000, // 1 second timeout
      analytics: true, // enable analytics
    })
  : null;

// Fallback in-memory rate limiter for development
class InMemoryRateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(limit: number, windowSeconds: number) {
    this.maxRequests = limit;
    this.windowMs = windowSeconds * 1000;
  }

  async check(identifier: string): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
    meta?: string;
  }> {
    const now = Date.now();
    const key = `ratelimit:${identifier}`;
    
    let record = this.requests.get(key);
    
    // If no record or expired, create new
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + this.windowMs,
      };
      this.requests.set(key, record);
    }
    
    // Clean up old entries periodically
    if (this.requests.size > 10000) {
      const keysToDelete: string[] = [];
      this.requests.forEach((value, k) => {
        if (now > value.resetTime) {
          keysToDelete.push(k);
        }
      });
      keysToDelete.forEach(k => this.requests.delete(k));
    }
    
    record.count++;
    
    const remaining = Math.max(0, this.maxRequests - record.count);
    const success = remaining > 0;
    
    return {
      success,
      limit: this.maxRequests,
      remaining,
      reset: record.resetTime,
      meta: "in-memory-fallback",
    };
  }
}

// Create fallback limiter instance
const fallbackLimiter = new InMemoryRateLimiter(100, 900);

// Helper function for API routes
export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  if (rateLimiter) {
    const result = await rateLimiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  }
  
  // Use fallback in-memory limiter
  const result = await fallbackLimiter.check(identifier);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

// Export Redis configuration status
export const isRedisAvailable = isRedisConfigured();
