// modules/messaging-integrations/messenger/messenger.pageSelection.service.ts

import axios from "axios";
import { MessagingIntegrationService } from "../integration.service";
import { fetchHistory } from "../history";

const GRAPH_API = "https://graph.facebook.com";

export const MessengerPageSelectionService = {
  async selectPage(businessId: string, pageId: string, userAccessToken: string) {

    // Fetch page info & page access token
    const pageResp = await axios.get(`${GRAPH_API}/${pageId}`, {
      params: {
        fields: "name,access_token",
        access_token: userAccessToken
      }
    });

    const pageAccessToken = pageResp.data.access_token;
    const pageName = pageResp.data.name;

    if (!pageAccessToken) {
      throw new Error("Unable to fetch pageAccessToken for selected page");
    }

    // Save integration
    const credentials = {
      pageId,
      pageName,
      pageAccessToken,
      selectedPage: true
    };

    await MessagingIntegrationService.connectIntegration(
      businessId,
      "messenger",
      credentials
    );

    // History fetch
    let historyResult = null;
    try {
      historyResult = await fetchHistory("messenger", businessId);
    } catch (err) {
      console.error("History fetch failed:", err);
    }

    return {
      connectedPage: { pageId, pageName },
      history_import: historyResult
    };
  }
};
