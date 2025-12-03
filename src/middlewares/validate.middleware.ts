import { z, ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export function validateBody(schema: ZodType<any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new AppError('Invalid request body: ' + result.error.message, 400));
    }
    req.body = result.data;
    next();
  };
}
