import { Request, Response, NextFunction } from "express";
import { IntegrationService } from "./integration.service";

export const IntegrationController = {
  connect: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const requestingUserId = req.user.id;
      const { businessId, platform, credentials, webhook_url } = req.body;

      const result = await IntegrationService.connectIntegration(
        requestingUserId,
        businessId,
        platform,
        credentials,
        webhook_url
      );

      res.status(200).json({ success: true, integration: result });
    } catch (err) {
      next(err);
    }
  },

  disconnect: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const requestingUserId = req.user.id;
      const { businessId, platform } = req.body;

      const result = await IntegrationService.disconnectIntegration(
        requestingUserId,
        businessId,
        platform
      );

      res.status(200).json({ success: true, integration: result });
    } catch (err) {
      next(err);
    }
  },

  getByBusiness: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.params.businessId;
      const integrations = await IntegrationService.getIntegrations(businessId);
      res.json({ integrations });
    } catch (err) {
      next(err);
    }
  },
};
