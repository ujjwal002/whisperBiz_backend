import { Request, Response, NextFunction } from "express";
import { ChatPreferenceService } from "./chatPreference.service";

export const ChatPreferenceController = {
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const requestingUserId = req.user.id;
      const { businessId, use_ai_reply } = req.body;

      const updated = await ChatPreferenceService.updatePreference(
        requestingUserId,
        businessId,
        use_ai_reply
      );

      res.json({ preference: updated });
    } catch (err) {
      next(err);
    }
  },

  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.params.businessId;

      const pref = await ChatPreferenceService.getPreference(businessId);
      res.json({ preference: pref });
    } catch (err) {
      next(err);
    }
  },
};
