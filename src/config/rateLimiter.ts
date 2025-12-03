import { RateLimiterMemory } from "rate-limiter-flexible";

export const globalRateLimiter = new RateLimiterMemory({
  points: 300,     // 300 requests
  duration: 60,     // per 1 min
});

export const authRateLimiter = new RateLimiterMemory({
  points: 10,       // 10 login attempts
  duration: 60,     // per 1 min
});
