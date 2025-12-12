// src/modules/messaging-integrations/history/whatsapp.ts
import { getIntegrationCredentials, ensurePlatformUser, linkUserToBusiness, saveMessageIfNotExists } from "./utils";

/**
 * Fetch WhatsApp Cloud API messages for a business and save them.
 * It relies on messaging_integrations.credentials containing:
 *   { apiKey: "<FB_PAGE_ACCESS_TOKEN>", phoneNumberId: "<phone_number_id>" }
 *
 * NOTE: WhatsApp does not provide a history endpoint equivalent to 'getUpdates'.
 * But you can fetch message templates or conversations using Graph API /{phone_number_id}/messages OR conversations endpoints depending on your access level.
 * This function attempts to call /{phone_number_id}/messages (may require business-level permissions).
 *
 * This implementation tries to fetch recent messages and process them. Adjust per your FB API version & permissions.
 */
export async function fetchWhatsAppHistory(businessId: string) {
  const credentials = await getIntegrationCredentials(businessId, 'whatsapp');
  if (!credentials) throw new Error('WhatsApp not configured for this business');

  const apiKey = credentials.apiKey || credentials.pageAccessToken || credentials.accessToken;
  const phoneNumberId = credentials.phoneNumberId || credentials.phoneNumber;

  if (!apiKey || !phoneNumberId) throw new Error('WhatsApp credentials incomplete (apiKey/phoneNumberId)');

  const results: any[] = [];
  let imported = 0;

  // Try to fetch messages (example endpoint — adapt to your Graph API permissions)
  // Graph API: GET /{phone-number-id}/messages (this endpoint may not be generally available)
  const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages?limit=100&access_token=${apiKey}`;

  const resp = await fetch(url, { method: 'GET' });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`WhatsApp history fetch failed: ${text}`);
  }

  const data = await resp.json() as { data?: any[] };
  const messages = data?.data ?? [];

  for (const m of messages) {
    try {
      // m should contain: id, from, text, timestamp
      const externalId = m.id || m.message_id || null;
      const from = m.from || m.from_number || null;
      const text = (m.text?.body) ?? (m.body) ?? (m.message) ?? "[media]";
      const timestamp = m.timestamp ? new Date(Number(m.timestamp) * 1000) : new Date();

      if (!from) continue;

      // ensure user
      const userDoc = await ensurePlatformUser('whatsapp', String(from), undefined);
      await linkUserToBusiness(String(userDoc._id), businessId);

      // save message if not exists
      const saved = await saveMessageIfNotExists({
        externalId,
        userId: String(userDoc._id),
        businessId,
        message: text,
        sender_type: 'user',
        created_at: timestamp,
        platform: 'whatsapp'
      });

      if (saved) imported++;
    } catch (err) {
      console.error('WhatsApp message import error', err);
    }
  }

  return { success: true, imported, rawCount: messages.length };
}
