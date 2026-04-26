import { Request, Response, NextFunction } from "express";
import { UserBusinessService } from "./userBusiness.service";

export const UserBusinessController = {
  addMember: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, business_id } = req.body;

      const member = await UserBusinessService.addMember(user_id, business_id);
      res.status(201).json({ member });
    } catch (err: any) {
      if (err.code === 11000) {
        return res.status(400).json({ message: "User already added to this business" });
      }
      next(err);
    }
  },

  removeMember: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, business_id } = req.body;

      await UserBusinessService.removeMember(user_id, business_id);
      res.json({ message: "User removed from business" });
    } catch (err) {
      next(err);
    }
  },

  listMembers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { businessId } = req.params;
      console.log("Listing members for business:", businessId);

      const members = await UserBusinessService.listMembers(businessId);
      res.json({ members });
    } catch (err) {
      next(err);
    }
  }
};
