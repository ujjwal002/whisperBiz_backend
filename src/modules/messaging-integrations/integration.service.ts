import { MessagingIntegrationRepository } from "./integration.repository";
import { MessagingIntegrationModel } from "./integration.model";

export const MessagingIntegrationService = {
  async connectIntegration(business_id: string, platform: string, credentials: any) {
    return MessagingIntegrationRepository.upsertIntegration(
      business_id,
      platform,
      credentials
    );
  },

  async disconnectIntegration(business_id: string, platform: string) {
    return MessagingIntegrationRepository.disconnect(business_id, platform);
  },

  async listIntegrations(business_id: string) {
    return MessagingIntegrationRepository.getAll(business_id);
  },

  async getIntegration(business_id: string, platform: string) {
    return MessagingIntegrationRepository.getOne(business_id, platform);
  },

  // ⭐ NEW IMPORTANT METHOD
  async getBusinessIdByPageId(pageId: string) {
    const integration = await MessagingIntegrationModel.findOne({
      platform: "messenger",
      "credentials.pageId": pageId
    }).lean();

    return integration?.business_id || null;
  }
};
