import { NormalizeMessage } from "../helpers/normalizeMessage";
import { WebhookProcessor } from "../helpers/webhookProcessor";

/**
 * WhatsApp specific service:
 * - Extract business id from webhook metadata or find mapping from phoneNumberId
 */
export const WhatsappService = {
  async handle(body: any) {
    const normalized = NormalizeMessage.whatsapp(body);

    // Try to get businessId from payload metadata
    const businessId =
      body?.entry?.[0]?.changes?.[0]?.value?.metadata?.business_id ||
      body?.entry?.[0]?.id || // fallback
      process.env.DEFAULT_BUSINESS_ID;

    if (!businessId) {
      console.warn("Whatsapp webhook: no businessId found");
      return;
    }

    await WebhookProcessor.processIncoming(normalized, businessId);
  }
};
