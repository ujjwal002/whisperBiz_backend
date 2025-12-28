// src/modules/messaging-integrations/history/messenger.ts
import { getIntegrationCredentials, ensurePlatformUser, linkUserToBusiness, saveMessageIfNotExists } from "./utils";

const GRAPH_API_VERSION = 'v24.0';  // Current stable as of Dec 2025

export async function fetchMessengerHistory(businessId: string) {
  const credentials = await getIntegrationCredentials(businessId, 'messenger');
  if (!credentials) throw new Error('Messenger not configured for this business');

  const token = credentials.pageAccessToken || credentials.apiKey || credentials.accessToken;
  const pageId = credentials.pageId || credentials.page_id;

  if (!token) throw new Error('Messenger pageAccessToken missing');
  if (!pageId) throw new Error('Messenger pageId missing from credentials');  // No fallback to 'me'

  let imported = 0;
  const conversationsUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/conversations?platform=MESSENGER&folder=inbox&limit=50&access_token=${token}`;

  const convResp = await fetch(conversationsUrl);
  if (!convResp.ok) {
    const text = await convResp.text();
    throw new Error(`Messenger conversations fetch failed: ${text}`);  // Will log exact API error
  }
  const convData = await convResp.json();
  const convs = convData?.data ?? [];
  console.log(`Found ${convs.length} Messenger conversations for page ${pageId}`);  // Debug: Check this in logs

  for (const conv of convs) {
    try {
      const convId = conv.id;
      let messagesUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/${convId}/messages?fields=from{message,created_time,id,name},message,created_time&limit=100&access_token=${token}`;
      let more = true;

      while (more) {
        await new Promise(r => setTimeout(r, 200));  // 200ms delay to avoid rate limits
        const msgResp = await fetch(messagesUrl);
        if (!msgResp.ok) {
          const text = await msgResp.text();
          console.error(`Failed to fetch messages for conv ${convId}: ${text}`);
          break;
        }
        const msgData = await msgResp.json();
        const messages = msgData?.data ?? [];
        console.log(`Fetched ${messages.length} messages for conv ${convId}`);  // Debug

        for (const m of messages) {
          try {
            const externalId = m.id;
            const fromId = m.from?.id ?? null;
            const text = m.message ?? "[media/attachment]";  // Handles non-text
            const ts = m.created_time ? new Date(m.created_time) : new Date();

            if (!fromId) {
              console.warn(`Skipping message ${externalId} - no from.id`);
              continue;
            }

            const pageIds = [pageId, credentials.pageId, credentials.page_id].filter(Boolean).map(String);
            const isFromPage = pageIds.includes(String(fromId));
            const sender_type = isFromPage ? 'admin' : 'user';

            const userExternalId = isFromPage ? `page_${fromId}` : String(fromId);
            const userDoc = await ensurePlatformUser('messenger', userExternalId, m.from?.name ?? undefined);

            await linkUserToBusiness(String(userDoc._id), businessId);

            const saved = await saveMessageIfNotExists({
              externalId,
              userId: String(userDoc._id),
              businessId,
              message: text,
              sender_type,
              created_at: ts,
              platform: 'messenger'
            });

            if (saved) imported++;
          } catch (err) {
            console.error(`Messenger message ${m.id} save error:`, err);
          }
        }

        // Paging
        if (msgData?.paging?.next) {
          messagesUrl = msgData.paging.next;
        } else {
          more = false;
        }
      }
    } catch (err) {
      console.error(`Messenger conv ${conv.id} processing error:`, err);
    }
  }

  console.log(`Messenger history import complete: ${imported} messages saved`);  // Final debug
  return { success: true, imported, rawCount: convs.length };
}