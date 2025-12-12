import { Request, Response, NextFunction } from "express";
import { MessagingIntegrationService } from "./integration.service";

export const MessagingIntegrationController = {
  connect: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { business_id, platform, credentials } = req.body;

      const integration = await MessagingIntegrationService.connectIntegration(
        business_id,
        platform,
        credentials
      );

      res.json({ integration });
    } catch (err) {
      next(err);
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
