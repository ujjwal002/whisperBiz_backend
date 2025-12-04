import { Request, Response, NextFunction } from "express";
import { IntegrationService } from "../../messaging-integrations/integration.service";
import { ChatPreferenceService } from "../../chat-preferences/chatPreference.service";
import { findOrCreatePlatformUser, saveIncomingMessage } from "../helpers/webhook.helpers";

export const MessengerWebhookController = {
  verify: async (req: Request, res: Response) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    return res.status(200).send(challenge);
  },

  handler: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const entry = req.body.entry?.[0];
      const messaging = entry?.messaging?.[0];

      if (!messaging) return res.status(200).send("ok");

      const externalId = messaging.sender.id;

      const integration = await IntegrationService.getActiveIntegration("messenger");
      if (!integration) return res.status(200).send("no integration");

      const businessId = integration.business_id;

      let textMsg = messaging.message?.text || "[Media]";

      const user = await findOrCreatePlatformUser(
        businessId,
        "messenger",
        externalId,
        `Messenger User ${externalId}`
      );

      await saveIncomingMessage(businessId, user._id.toString(), textMsg);

      // AI Reply
      const useAI = await ChatPreferenceService.shouldUseAI(businessId);
      if (useAI) {
        // TODO: send AI reply to Messenger API
      }

      res.status(200).send("ok");
    } catch (err) {
      next(err);
    }
  },
};
