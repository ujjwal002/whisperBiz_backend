export type Platform = "whatsapp" | "telegram" | "messenger";

export interface NormalizedMessage {
  externalUserId: string;   // id from platform (phone, chat id, psid)
  platform: Platform;
  message: string;
  raw?: any;
  metadata?: Record<string, any>;
}

export const NormalizeMessage = {
  whatsapp(body: any): NormalizedMessage {
    // WhatsApp Cloud API format: entry[].changes[].value.messages[]
    const msg = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const metadata = body?.entry?.[0]?.changes?.[0]?.value?.metadata || {};
    return {
      externalUserId: msg?.from ?? "",
      message: msg?.text?.body ?? msg?.type ?? "",
      platform: "whatsapp",
      raw: msg,
      metadata
    };
  },

  telegram(body: any): NormalizedMessage {
    // Telegram Bot update: message.from.id and message.text/caption
    const m = body?.message;
    const text = m?.text ?? m?.caption ?? "";
    return {
      externalUserId: String(m?.chat?.id ?? ""),
      message: text,
      platform: "telegram",
      raw: body,
      metadata: { chatId: m?.chat?.id }
    };
  },

  messenger(body: any): NormalizedMessage {
    // Messenger webhook: entry[].messaging[]
    const messaging = body?.entry?.[0]?.messaging?.[0] ?? {};
    const text = messaging?.message?.text ?? "";
    return {
      externalUserId: messaging?.sender?.id ?? "",
      message: text,
      platform: "messenger",
      raw: messaging,
      metadata: { pageId: body?.entry?.[0]?.id }
    };
  }
};
