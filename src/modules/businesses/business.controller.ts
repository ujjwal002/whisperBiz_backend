// src/modules/businesses/business.controller.ts
import { Request, Response, NextFunction } from "express";
import { BusinessService } from "./business.service";

export const BusinessController = {
  getMyBusiness: async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const business = await BusinessService.getMyBusiness(userId);
      if (!business)
        return res.status(404).json({ error: "Business not found" });

      res.json({ business });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: any, res: Response, next: NextFunction) => {
    try {
      const business = await BusinessService.getById(req.params.id);
      if (!business)
        return res.status(404).json({ error: "Business not found" });

      res.json({ business });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const updated = await BusinessService.updateBusiness(
        userId,
        req.params.id,
        req.body
      );

      if (!updated)
        return res
          .status(404)
          .json({ error: "Business not found or unauthorized" });

      res.json({ business: updated });
    } catch (err) {
      next(err);
    }
  },
};
