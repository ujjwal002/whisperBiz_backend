import { NormalizeMessage } from "../helpers/normalizeMessage";
import { WebhookProcessor } from "../helpers/webhookProcessor";
import { MessagingIntegrationService } from "../../messaging-integrations/integration.service";

export const MessengerService = {
  async handle(body: any) {
    const normalized = NormalizeMessage.messenger(body);
    console.log("Messenger webhook received:", JSON.stringify(normalized).slice(0, 500));

    const entry = body?.entry?.[0];
    const pageId = entry?.id;  // Messenger page ID (not businessId)

    if (!pageId) {
      console.warn("Messenger webhook: missing pageId");
      return;
    }

    // ⭐ FIX: Find the correct business using pageId
    const businessId = await MessagingIntegrationService.getBusinessIdByPageId(pageId);

    if (!businessId) {
      console.warn("Messenger webhook: No business mapped to pageId:", pageId);
      return;
    }

    // Continue with normal processing
    await WebhookProcessor.processIncoming(normalized, businessId);
  }
};
