// modules/messaging-integrations/messenger/messenger.oauth.service.ts
import axios from "axios";
import { MessagingIntegrationService } from "../integration.service";
import { fetchHistory } from "../history";

const GRAPH_API = "https://graph.facebook.com";

export const MessengerOAuthService = {
  generateAuthUrl(businessId: string) {
    const appId = process.env.MESSENGER_APP_ID;
    const redirectUri = process.env.MESSENGER_REDIRECT_URI; // e.g. https://yourdomain.com/integrations/messenger/callback
    if (!appId || !redirectUri) {
      throw new Error("MESSENGER_APP_ID and MESSENGER_REDIRECT_URI must be set");
    }

    const scopes = [
      "pages_show_list",
      "pages_messaging",
      "pages_read_engagement",
      "pages_manage_metadata",
      "pages_read_user_content"
    ].join(",");

    // state will be your businessId so we can map the returned code to the correct business.
    return `https://www.facebook.com/v17.0/dialog/oauth?client_id=${encodeURIComponent(appId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${encodeURIComponent(businessId)}`;
  },

  /**
   * Exchanges the code for a short-lived user access token,
   * upgrades it to a long-lived token, fetches pages the user manages,
   * saves page credential(s) to the MessagingIntegration collection,
   * and triggers history import.
   *
   * Returns: { pages: [...], saved: { pageId, pageAccessToken, pageName }, raw }
   */
  async handleCallback(code: string, businessId: string) {
    const appId = process.env.MESSENGER_APP_ID!;
    const appSecret = process.env.MESSENGER_APP_SECRET!;
    const redirectUri = process.env.MESSENGER_REDIRECT_URI;
    if (!appId || !appSecret || !redirectUri) {
      throw new Error("Missing MESSENGER_APP_ID / MESSENGER_APP_SECRET / MESSENGER_REDIRECT_URI");
    }

    // 1) Code -> short-lived user access token
    const tokenExchangeUrl = `${GRAPH_API}/v17.0/oauth/access_token`;
    const tokenResp = await axios.get(tokenExchangeUrl, {
      params: {
        client_id: appId,
        redirect_uri: redirectUri,
        client_secret: appSecret,
        code,
      },
    });

    const userAccessToken = tokenResp.data?.access_token;
    if (!userAccessToken) throw new Error("Failed to obtain user access token");

    // 2) Exchange short-lived user token for long-lived user token
    // (recommended so your user token lasts longer)
    const longLivedResp = await axios.get(`${GRAPH_API}/v17.0/oauth/access_token`, {
      params: {
        grant_type: "fb_exchange_token",
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: userAccessToken,
      },
    });

    const longLivedUserToken = longLivedResp.data?.access_token || userAccessToken;

    // 3) Get pages the user manages (each page has a page access token)
    const pagesResp = await axios.get(`${GRAPH_API}/me/accounts`, {
      params: { access_token: longLivedUserToken },
    });

    const pages = pagesResp.data?.data || [];
    if (!Array.isArray(pages)) throw new Error("Failed to fetch pages");

    if (pages.length === 0) {
      throw new Error("User does not manage any Facebook Pages");
    }

    // Pick the first page by default (sensible default). You can extend this:
    // - Return pages to frontend for manual selection if multiple pages exist.
    const firstPage = pages[0];
    const pageId = firstPage.id;
    const pageAccessToken = firstPage.access_token;
    const pageName = firstPage.name || null;

    // Optionally: exchange page token for long-lived page token (page tokens are usually long)
    // We'll assume pageAccessToken is usable. If you want, you can call /{page-id}?fields=access_token with app token.

    const credentials = {
      pageId,
      pageName,
      pageAccessToken,
      rawPages: pages, // include raw list so frontend can inspect if needed
    };

    // 4) Save integration in your DB using existing service
    await MessagingIntegrationService.connectIntegration(businessId, "messenger", credentials);

    // 5) Trigger immediate history fetch (best-effort, don't fail overall flow if it errors)
    let historyResult = null;
    try {
      historyResult = await fetchHistory("messenger", businessId);
    } catch (err) {
      console.error("History fetch failed after messenger connect:", err);
    }

    return {
      pages,
      saved: { pageId, pageName },
      history_import: historyResult || null,
    };
  },
};
