import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AppError } from '../utils/appError';
import dotenv from 'dotenv';
dotenv.config();

// For Messenger verify of incoming webhooks, Meta provides X-Hub-Signature-256 in v2
export function verifyMessengerSignatureMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const secret = process.env.FACEBOOK_APP_SECRET;
    if (!secret) return next(); // skip if not configured
    const signature = req.headers['x-hub-signature-256'] as string | undefined;
    if (!signature) return next(new AppError('Missing signature', 400));
    const body = JSON.stringify(req.body);
    const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
      return next(new AppError('Invalid signature', 403));
    }
    next();
  } catch (err) {
    next(new AppError('Signature verification failed', 403));
  }
}
