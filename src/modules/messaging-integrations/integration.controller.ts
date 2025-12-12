import { Request, Response, NextFunction } from "express";
import { MessagingIntegrationService } from "./integration.service";
import { fetchHistory } from "./history";


export const MessagingIntegrationController = {
  async connect(req, res) {
    try {
      const { businessId, platform, credentials } = req.body;

      if (!businessId || !platform) {
        return res.status(400).json({ error: "businessId & platform are required" });
      }

      // 1) Save / update integration
      const integration = await MessagingIntegrationService.connectIntegration(
        businessId,
        platform,
        credentials
      );

      console.log("Integration saved. Triggering history fetch...");

      // 2) Fetch history immediately
      let historyResult = null;
      try {
        historyResult = await fetchHistory(platform, businessId);
        console.log("History import completed:", historyResult);
      } catch (err) {
        console.error("⚠ History fetch failed:", err);
      }

      return res.json({
        success: true,
        message: "Integration connected successfully",
        integration,
        history_import: historyResult || "History fetch failed",
      });
    } catch (err) {
      console.error("Integration Connect Error:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  disconnect: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { business_id, platform } = req.body;

      const integration = await MessagingIntegrationService.disconnectIntegration(
        business_id,
        platform
      );

      res.json({ success: true, integration });
    } catch (err) {
      next(err);
    }
  },

  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.params.businessId;
      const integrations = await MessagingIntegrationService.listIntegrations(businessId);

      res.json({ integrations });
    } catch (err) {
      next(err);
    }
  }
};
