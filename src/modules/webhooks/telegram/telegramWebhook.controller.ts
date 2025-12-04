import { Request, Response, NextFunction } from "express";
import { IntegrationService } from "../../messaging-integrations/integration.service";
import { ChatPreferenceService } from "../../chat-preferences/chatPreference.service";
import { findOrCreatePlatformUser, saveIncomingMessage } from "../helpers/webhook.helpers";

export const TelegramWebhookController = {
  handler: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;

      if (!payload.message) return res.status(200).send("ok");

      const message = payload.message;
      const externalId = String(message.from.id);

      // Find Telegram integration (active)
      const integration = await IntegrationService.getActiveIntegration("telegram");
      if (!integration) return res.status(200).send("no integration");

      const businessId = integration.business_id;

      const name = `${message.from.first_name || ""} ${message.from.last_name || ""}`.trim();
      const user = await findOrCreatePlatformUser(businessId, "telegram", externalId, name);

      const textMsg = message.text || "[Media]";
      await saveIncomingMessage(businessId, user._id.toString(), textMsg);

      // Check AI preference
      const useAI = await ChatPreferenceService.shouldUseAI(businessId);

      if (useAI) {
        // TODO: Add AI response logic here
      }

      return res.status(200).send("ok");
    } catch (err) {
      next(err);
    }
  },
};
