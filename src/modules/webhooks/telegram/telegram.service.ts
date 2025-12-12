import { NormalizeMessage } from "../helpers/normalizeMessage";
import { WebhookProcessor } from "../helpers/webhookProcessor";

/**
 * Telegram webhook handler
 * - businessId is expected in query param or a token mapping (implement as needed)
 */
export const TelegramService = {
  async handle(body: any) {
    const normalized = NormalizeMessage.telegram(body);

    // If you send Telegram webhook URL with businessId as query param, you need to parse it
    // Example request: POST /webhooks/telegram?businessId=xxx
    // The router/controller can pass the req.query; here we'll try to pick from raw body or fallback
    const businessId =
      body?.business_id ||
      process.env.DEFAULT_BUSINESS_ID;

    if (!businessId) {
      console.warn("Telegram webhook: no businessId found");
      return;
    }

    await WebhookProcessor.processIncoming(normalized, businessId);
  }
};
