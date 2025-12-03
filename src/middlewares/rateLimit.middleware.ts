import { Request, Response, NextFunction } from 'express';
import { globalRateLimiter } from '../config/rateLimiter';
import { AppError } from '../utils/appError';

export async function rateLimiterMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    await globalRateLimiter.consume(ip);
    next();
  } catch (err) {
    next(new AppError('Too many requests', 429));
  }
}
