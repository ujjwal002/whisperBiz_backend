import { NextFunction, Request, Response } from "express";
import { globalRateLimiter } from "../config/rateLimiter";
import { AppError } from "../utils/appError";

export const rateLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ipHeader = req.headers['x-forwarded-for'];
    const ip =
      typeof ipHeader === 'string'
        ? ipHeader.split(',')[0].trim()
        : req.ip ?? req.socket?.remoteAddress ?? 'unknown';

    await globalRateLimiter.consume(ip);
    next();
  } catch {
    next(new AppError("Too many requests", 429));
  }
};
