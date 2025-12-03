import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth.middleware';
import { Business } from '../modules/businesses/business.model';
import { AppError } from '../utils/appError';

export async function businessOwnerMiddleware(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const businessId = (req.params.businessId || req.body.businessId || req.query.businessId) as string;
    if (!businessId) return next(new AppError('businessId required', 400));
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));
    const biz = await Business.findById(businessId).lean();
    if (!biz) return next(new AppError('Business not found', 404));
    if (biz.owner_user_id !== userId) return next(new AppError('Forbidden - not business owner', 403));
    next();
  } catch (err) {
    next(err);
  }
}
