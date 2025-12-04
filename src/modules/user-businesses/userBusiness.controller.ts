import { Request, Response, NextFunction } from "express";
import { UserBusinessService } from "./userBusiness.service";

/**
 * Endpoints:
 * - POST /api/user-businesses/add  (owner only)
 * - POST /api/user-businesses/remove (owner only)
 * - GET  /api/user-businesses/:businessId/members
 */

export const UserBusinessController = {
  addMember: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const requestingUserId = req.user.id;
      const { businessId, userId, role } = req.body;
      const assoc = await UserBusinessService.addUserToBusiness(requestingUserId, businessId, userId, role);
      res.status(201).json({ association: assoc });
    } catch (err) {
      next(err);
    }
  },

  removeMember: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const requestingUserId = req.user.id;
      const { businessId, userId } = req.body;
      const removed = await UserBusinessService.removeUserFromBusiness(requestingUserId, businessId, userId);
      res.json({ removed });
    } catch (err) {
      next(err);
    }
  },

  listMembers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const requestingUserId = req.user.id;
      const businessId = req.params.businessId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;
      const members = await UserBusinessService.listMembers(requestingUserId, businessId, page, limit);
      res.json({ members });
    } catch (err) {
      next(err);
    }
  },
};
