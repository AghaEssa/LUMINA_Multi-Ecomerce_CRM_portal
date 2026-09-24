import { NextResponse } from "next/server";

export type RateLimitOptions = {
  windowMs: number; // Time window in milliseconds (e.g., 60,000 for 1 min)
  maxRequests: number; // Maximum allowed requests within the window
  keyPrefix?: string; // Optional prefix to separate different API endpoints
};

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
};

type RateLimitRecord = {
  count: number;
  resetTime: number;
};

// Global in-memory storage for rate limit records
const rateLimitMap = new Map<string, RateLimitRecord>();

// Periodic cleanup of expired records every 2 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 120_000);
}

/**
 * Extracts client IP address safely from Request headers
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Checks rate limit for a request based on client IP & endpoint key
 */
export function checkRateLimit(
  req: Request,
  options: RateLimitOptions
): RateLimitResult {
  const { windowMs, maxRequests, keyPrefix = "global" } = options;
  const ip = getClientIp(req);
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();

  let record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitMap.set(key, record);
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  record.count += 1;
  const remaining = Math.max(0, maxRequests - record.count);
  const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

  if (record.count > maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetSeconds,
    };
  }

  return {
    success: true,
    limit: maxRequests,
    remaining,
    resetSeconds,
  };
}

/**
 * Generates a pre-formatted 429 Too Many Requests response with standard headers
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  const response = NextResponse.json(
    {
      success: false,
      error: {
        code: "TOO_MANY_REQUESTS",
        message: `Too many requests. Please wait ${result.resetSeconds} second(s) before trying again.`,
      },
    },
    { status: 429 }
  );

  response.headers.set("X-RateLimit-Limit", result.limit.toString());
  response.headers.set("X-RateLimit-Remaining", "0");
  response.headers.set("X-RateLimit-Reset", result.resetSeconds.toString());
  response.headers.set("Retry-After", result.resetSeconds.toString());

  return response;
}

/**
 * Applies Rate Limit headers to a successful response
 */
export function applyRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
): NextResponse {
  response.headers.set("X-RateLimit-Limit", result.limit.toString());
  response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
  response.headers.set("X-RateLimit-Reset", result.resetSeconds.toString());
  return response;
}

// Pre-defined Preset Configs
export const RateLimitPresets = {
  AUTH: {
    windowMs: 60_000, // 1 minute
    maxRequests: 10, // Max 10 attempts per minute
    keyPrefix: "auth-limit",
  },
  STRICT_SENSITIVE: {
    windowMs: 60_000,
    maxRequests: 5, // Max 5 attempts per minute
    keyPrefix: "strict-limit",
  },
  GENERAL_API: {
    windowMs: 60_000,
    maxRequests: 60, // Max 60 requests per minute
    keyPrefix: "api-limit",
  },
};
