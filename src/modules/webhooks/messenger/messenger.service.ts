import { NormalizeMessage } from "../helpers/normalizeMessage";
import { WebhookProcessor } from "../helpers/webhookProcessor";

/**
 * Messenger webhook handler:
 * - Messenger includes page id in entry[].id which we can map to business
 */
export const MessengerService = {
  async handle(body: any) {
    const normalized = NormalizeMessage.messenger(body);

    const businessId =
      body?.entry?.[0]?.id ||
      process.env.DEFAULT_BUSINESS_ID;

    if (!businessId) {
      console.warn("Messenger webhook: no businessId found");
      return;
    }

    await WebhookProcessor.processIncoming(normalized, businessId);
  }
};
