// src/modules/messaging-integrations/history/telegram.ts
import { getIntegrationCredentials, ensurePlatformUser, linkUserToBusiness, saveMessageIfNotExists } from "./utils";

/**
 * Fetch Telegram bot updates via getUpdates.
 * credentials should contain { apiKey: "<bot_token>" }
 *
 * Note: getUpdates returns updates that are not yet acknowledged (if webhook not used). If you used setWebhook previously, getUpdates may be empty.
 * For bots using webhook, you may need to rely on your own storage. Another option: use getChatHistory via forward/requests (requires chat id).
 */
export async function fetchTelegramHistory(businessId: string) {
  const credentials = await getIntegrationCredentials(businessId, 'telegram');
  if (!credentials) throw new Error('Telegram not configured for this business');

  const apiKey = credentials.apiKey || credentials.token;
  if (!apiKey) throw new Error('Telegram credentials incomplete (apiKey)');

  let imported = 0;

  const url = `https://api.telegram.org/bot${apiKey}/getUpdates?limit=100`;
  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Telegram getUpdates failed: ${text}`);
  }
  const data = await resp.json();
  const updates = data?.result ?? [];

  for (const u of updates) {
    try {
      // support message & edited_message
      const msg = u.message ?? u.edited_message;
      if (!msg) continue;

      const chatId = msg.chat?.id;
      const fromId = msg.from?.id ?? (msg.chat?.id);
      const text = msg.text ?? msg.caption ?? "[media]";
      const externalId = msg.message_id ? `${chatId}_${msg.message_id}` : null;
      const ts = msg.date ? new Date(msg.date * 1000) : new Date();

      const userDoc = await ensurePlatformUser('telegram', String(fromId), `${msg.from?.first_name ?? ''} ${msg.from?.last_name ?? ''}`.trim() || undefined);
      await linkUserToBusiness(String(userDoc._id), businessId);

      const saved = await saveMessageIfNotExists({
        externalId,
        userId: String(userDoc._id),
        businessId,
        message: text,
        sender_type: 'user',
        created_at: ts,
        platform: 'telegram'
      });

      if (saved) imported++;
    } catch (err) {
      console.error('Telegram import error', err);
    }
  }

  return { success: true, imported, rawCount: updates.length };
}
