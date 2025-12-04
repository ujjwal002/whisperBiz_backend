import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { UserBusiness } from "..//modules/user-businesses/userBusiness.model";

export const requireBusinessOwner = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.params.businessId || req.body.businessId;

      if (!businessId) {
        return next(new AppError("Business ID required", 400));
      }

      // @ts-ignore
      const userId = req.user.id;

      const link = await UserBusiness.findOne({ user_id: userId, business_id: businessId });

      if (!link) {
        return next(new AppError("You are not the owner of this business", 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
