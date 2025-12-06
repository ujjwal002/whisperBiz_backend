import { Request, Response, NextFunction } from "express";
import { BusinessService } from "./business.service";

export const BusinessController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      console.log("Req user:", req.user);
      const ownerUserId = req.user.id;
      const { business_name, email } = req.body;

      const business = await BusinessService.createBusiness(ownerUserId, business_name, email);
      res.status(201).json({ business });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const ownerUserId = req.user.id;
      const { businessId } = req.params;

      const updated = await BusinessService.updateBusiness(ownerUserId, businessId, req.body);
      res.json({ business: updated });
    } catch (err) {
      next(err);
    }
  },

  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const { businessId } = req.params;

      const business = await BusinessService.getBusiness(userId, businessId);
      res.json({ business });
    } catch (err) {
      next(err);
    }
  },

  listOwned: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const userId = req.user.id;

      const businesses = await BusinessService.getBusinessesForUser(userId);
      res.json({ businesses });
    } catch (err) {
      next(err);
    }
  },
};
