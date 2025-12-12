// src/modules/businesses/business.controller.ts
import { Request, Response, NextFunction } from "express";
import { BusinessService } from "./business.service";

export const BusinessController = {
  /**
   * GET /api/businesses/my
   * Returns the business owned by the authenticated user
   */
  getMyBusiness: async (req: any, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) return res.status(401).json({ error: "Unauthorized" });

      const business = await BusinessService.getByOwner(ownerId);
      if (!business) return res.status(404).json({ error: "Business not found" });

      res.json({ business });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/businesses/:id
   * Returns business by id. Owner or member check can be added if needed.
   */
  getById: async (req: any, res: Response, next: NextFunction) => {
    try {
      const businessId = req.params.id;
      const business = await BusinessService.getById(businessId);
      if (!business) return res.status(404).json({ error: "Business not found" });
      res.json({ business });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/businesses/:id
   * Update business fields (owner only)
   */
  update: async (req: any, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) return res.status(401).json({ error: "Unauthorized" });

      const businessId = req.params.id;
      const updatePayload = req.body;

      // Disallow critical field changes
      delete updatePayload.owner_user_id;
      delete updatePayload.business_code;
      delete updatePayload._id;

      const updated = await BusinessService.updateByOwner(ownerId, businessId, updatePayload);
      if (!updated) return res.status(404).json({ error: "Business not found or unauthorized" });

      res.json({ business: updated });
    } catch (err) {
      next(err);
    }
  },
};
