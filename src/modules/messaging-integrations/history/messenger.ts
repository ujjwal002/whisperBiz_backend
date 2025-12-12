// src/modules/messaging-integrations/history/messenger.ts
import { getIntegrationCredentials, ensurePlatformUser, linkUserToBusiness, saveMessageIfNotExists } from "./utils";

/**
 * Fetch Facebook Page conversations -> messages
 * credentials: { pageAccessToken, pageId (optional) }
 *
 * The code lists conversations and then fetches messages per conversation.
 */
export async function fetchMessengerHistory(businessId: string) {
  const credentials = await getIntegrationCredentials(businessId, 'messenger');
  if (!credentials) throw new Error('Messenger not configured for this business');

  const token = credentials.pageAccessToken || credentials.apiKey || credentials.accessToken;
  const pageId = credentials.pageId || credentials.page_id || null;

  if (!token) throw new Error('Messenger pageAccessToken missing');

  let imported = 0;
  const conversationsUrl = `https://graph.facebook.com/v17.0/${pageId || 'me'}/conversations?limit=50&access_token=${token}`;

  const convResp = await fetch(conversationsUrl);
  if (!convResp.ok) {
    const text = await convResp.text();
    throw new Error(`Messenger conversations fetch failed: ${text}`);
  }
  const convData = await convResp.json();
  const convs = convData?.data ?? [];

  for (const conv of convs) {
    try {
      const convId = conv.id;
      // fetch messages for conversation (paging)
      let messagesUrl = `https://graph.facebook.com/v17.0/${convId}/messages?limit=100&access_token=${token}`;
      let more = true;

      while (more) {
        const msgResp = await fetch(messagesUrl);
        if (!msgResp.ok) {
          const text = await msgResp.text();
          console.error('Failed to fetch conversation messages', text);
          break;
        }
        const msgData = await msgResp.json();
        const messages = msgData?.data ?? [];

        for (const m of messages) {
          try {
            // message structure: from { id, name }, message, created_time, id
            const externalId = m.id;
            const fromId = m.from?.id ?? null;
            const text = m.message ?? "[media]";
            const ts = m.created_time ? new Date(m.created_time) : new Date();

            if (!fromId) continue;

            // skip messages sent by the page itself
            // page owner id can be in credentials.pageId or in conv.to
            const pageIds = [pageId, credentials.pageId, credentials.page_id].filter(Boolean).map(String);
            const isFromPage = pageIds.includes(String(fromId));
            const sender_type = isFromPage ? 'admin' : 'user';

            // for user messages, create or ensure user
            const userExternalId = isFromPage ? `page_${fromId}` : String(fromId);
            const userDoc = await ensurePlatformUser('messenger', userExternalId, m.from?.name ?? undefined);

            await linkUserToBusiness(String(userDoc._id), businessId);

            // normalize userId (for page messages we still store page as a user record)
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
            console.error('Messenger message loop error', err);
          }
        }

        // paging
        if (msgData?.paging?.next) {
          messagesUrl = msgData.paging.next;
        } else {
          more = false;
        }
      }
    } catch (err) {
      console.error('Messenger conversation processing error', err);
    }
  }

  return { success: true, imported, rawCount: convs.length };
}
