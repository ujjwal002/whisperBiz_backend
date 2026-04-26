import { NormalizeMessage } from "../helpers/normalizeMessage";
import { WebhookProcessor } from "../helpers/webhookProcessor";
import { ChatMessageModel } from "../../chat-messages/chatMessage.model";

export const TelegramService = {
  async handle(body: any, businessId: string) {
    // Telegram unique update id
    const updateId = body?.update_id;
    console.log("Received Telegram webhook:", { updateId, businessId });

    // prevent duplicate processing
    if (updateId) {
      const exists = await ChatMessageModel.findOne({
        "raw.update_id": updateId,
      });

      if (exists) {
        console.log("Duplicate Telegram webhook ignored:", updateId);
        return;
      }
    }

    const normalized = NormalizeMessage.telegram(body);

    if (!businessId) {
      console.warn("Telegram webhook: no businessId found");
      return;
    }

    await WebhookProcessor.processIncoming(normalized, businessId);
  }
};