// modules/messaging-integrations/messenger/messenger.pageSelection.controller.ts
import { Request, Response } from "express";
import { MessengerPageSelectionService } from "./messenger.pageSelection.service";

export const MessengerPageSelectionController = {
  async selectPage(req: Request, res: Response) {
    try {
      const { businessId, pageId, userAccessToken } = req.body;

      if (!businessId) return res.status(400).json({ error: "businessId is required" });
      if (!pageId) return res.status(400).json({ error: "pageId is required" });
      if (!userAccessToken) return res.status(400).json({ error: "userAccessToken is required" });

      const result = await MessengerPageSelectionService.selectPage(
        businessId,
        pageId,
        userAccessToken
      );

      return res.json({
        success: true,
        message: "Page connected successfully",
        ...result
      });

    } catch (err: any) {
      console.error("Page selection error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
};
