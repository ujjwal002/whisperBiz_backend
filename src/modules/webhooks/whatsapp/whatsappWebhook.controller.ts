import { Request, Response, NextFunction } from "express";
import { IntegrationService } from "../../messaging-integrations/integration.service";
import { ChatPreferenceService } from "../../chat-preferences/chatPreference.service";
import { findOrCreatePlatformUser, saveIncomingMessage } from "../helpers/webhook.helpers";

export const WhatsAppWebhookController = {
  handler: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;

      const entry = payload.entry?.[0];
      const change = entry?.changes?.[0]?.value;
      const message = change?.messages?.[0];
      const contact = change?.contacts?.[0];

      if (!message) return res.status(200).send("ok");

      const externalId = message.from;

      const integration = await IntegrationService.getActiveIntegration("whatsapp");
      if (!integration) return res.status(200).send("no integration");

      const businessId = integration.business_id;

      const name = contact?.profile?.name || externalId;

      const user = await findOrCreatePlatformUser(businessId, "whatsapp", externalId, name);

      const textMsg = message.text?.body || "[Media]";
      await saveIncomingMessage(businessId, user._id.toString(), textMsg);

      // AI Reply
      const useAI = await ChatPreferenceService.shouldUseAI(businessId);
      if (useAI) {
        // TODO: Add AI response logic + send back to WhatsApp API
      }

      res.status(200).send("ok");
    } catch (err) {
      next(err);
    }
  },
};
