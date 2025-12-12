import { Request, Response, NextFunction } from "express";
import { ChatPreferenceService } from "./chatPreference.service";

export const ChatPreferenceController = {
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, business_id, use_ai_reply } = req.body;

      const updated = await ChatPreferenceService.updatePreference(
        user_id,
        business_id,
        use_ai_reply
      );

      res.json({ preference: updated });
    } catch (err) {
      next(err);
    }
  },

  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, businessId } = req.params;
      const pref = await ChatPreferenceService.getPreference(userId, businessId);
      res.json({ preference: pref });
    } catch (err) {
      next(err);
    }
  }
};
