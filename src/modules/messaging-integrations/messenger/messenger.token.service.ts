import axios from "axios";
import { MessagingIntegrationModel } from "../integration.model";

const GRAPH_API = "https://graph.facebook.com";

export const MessengerTokenService = {
  async refreshExpiredTokens() {
    const now = new Date();

    // Find integrations where tokens are expired or about to expire (in 7 days)
    const integrations = await MessagingIntegrationModel.find({
      platform: "messenger",
      is_connected: true,
      $or: [
        { longLivedUserTokenExpiresAt: { $lte: now } },
        { pageAccessTokenExpiresAt: { $lte: now } }
      ]
    });

    for (const integration of integrations) {
      try {
        const { longLivedUserToken } = integration.credentials;

        if (!longLivedUserToken) continue;

        // Refresh long-lived user token
        const resp = await axios.get(`${GRAPH_API}/v17.0/oauth/access_token`, {
          params: {
            grant_type: "fb_exchange_token",
            client_id: process.env.MESSENGER_APP_ID,
            client_secret: process.env.MESSENGER_APP_SECRET,
            fb_exchange_token: longLivedUserToken,
          },
        });

        const newUserToken = resp.data.access_token;
        const expiresIn = resp.data.expires_in; // seconds

        const expiration = new Date(Date.now() + expiresIn * 1000);

        // Fetch page tokens again
        const pages = await axios.get(`${GRAPH_API}/me/accounts`, {
          params: { access_token: newUserToken },
        });

        const firstPage = pages.data.data[0];

        integration.credentials.pageAccessToken = firstPage.access_token;
        integration.credentials.pageAccessTokenExpiresAt = expiration;
        integration.credentials.longLivedUserToken = newUserToken;
        integration.credentials.longLivedUserTokenExpiresAt = expiration;

        await integration.save();

        console.log(`🔄 Refreshed Messenger tokens for business ${integration.business_id}`);
      } catch (err) {
        console.error("Messenger token refresh failed:", err);
      }
    }
  }
};
