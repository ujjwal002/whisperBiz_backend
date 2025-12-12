
/**
 * credentials: from messagingIntegrations record. Structure is flexible:
 * - whatsapp: { apiKey, phoneNumberId } (example)
 * - telegram: { apiKey }
 * - messenger: { pageAccessToken }
 */

export const SendReply = {
  async whatsapp(externalUserId: string, text: string, credentials: any) {
    // TODO: implement real WhatsApp Cloud API call
    // Example URL: https://graph.facebook.com/v17.0/{phone_number_id}/messages
    const { apiKey, phoneNumberId } = credentials ?? {};
    if (!apiKey || !phoneNumberId) {
      console.warn("WhatsApp credentials missing — cannot send", { externalUserId });
      return { ok: false, reason: "no_credentials" };
    }

    const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;
    const body = {
      messaging_product: "whatsapp",
      to: externalUserId,
      type: "text",
      text: { body: text }
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    return { ok: res.ok, data };
  },

  async telegram(externalUserId: string, text: string, credentials: any) {
    const { apiKey } = credentials ?? {};
    if (!apiKey) {
      console.warn("Telegram credentials missing — cannot send", { externalUserId });
      return { ok: false, reason: "no_credentials" };
    }

    const url = `https://api.telegram.org/bot${apiKey}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: externalUserId, text })
    });

    const data = (await res.json()) as { ok: boolean; [key: string]: any };
    return { ok: res.ok && data.ok, data };
  },

  async messenger(externalUserId: string, text: string, credentials: any) {
    const token = credentials?.pageAccessToken;
    if (!token) {
      console.warn("Messenger credentials missing — cannot send", { externalUserId });
      return { ok: false, reason: "no_credentials" };
    }

    const url = `https://graph.facebook.com/v17.0/me/messages?access_token=${token}`;
    const body = {
      recipient: { id: externalUserId },
      message: { text }
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    return { ok: res.ok, data };
  }
};
