import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth.middleware';
import { AppError } from '../utils/appError';

export function roleMiddleware(requiredRole: string) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return next(new AppError('Unauthorized', 401));
    if (user.role !== requiredRole) return next(new AppError('Forbidden', 403));
    next();
  };
}
