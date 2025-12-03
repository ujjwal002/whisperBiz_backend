import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../libs/jwt';
import { AppError } from '../utils/appError';

export interface AuthRequest extends Request {
  user?: { id: string; role?: string; email?: string };
}

export function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return next(new AppError('Authorization header missing', 401));
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return next(new AppError('Invalid authorization', 401));
  try {
    const payload = verifyAccessToken(token);
    req.user = payload as any;
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
}
