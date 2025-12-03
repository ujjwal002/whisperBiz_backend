import { Request, Response, NextFunction } from 'express';
import { AppError } from './appError';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error('Unhandled error', err);
  return res.status(500).json({ error: 'Internal server error' });
}
