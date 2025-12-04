import { IntegrationRepository } from "./integration.repository";
import { BusinessRepository } from "../businesses/business.repository";
import { AppError } from "../../utils/appError";

export const IntegrationService = {
  async connectIntegration(requestingUserId: string, businessId: string, platform: string, credentials: any, webhook_url?: string) {
    const business = await BusinessRepository.findById(businessId);
    if (!business) throw new AppError("Business not found", 404);

    // Only owner can connect integrations
    if (String(business.owner_user_id) !== String(requestingUserId)) {
      throw new AppError("Only business owner can connect integrations", 403);
    }

    return IntegrationRepository.update(
      businessId,
      platform,
      {
        is_connected: true,
        credentials,
        webhook_url,
      }
    );
  },

  async disconnectIntegration(requestingUserId: string, businessId: string, platform: string) {
    const business = await BusinessRepository.findById(businessId);
    if (!business) throw new AppError("Business not found", 404);

    if (String(business.owner_user_id) !== String(requestingUserId)) {
      throw new AppError("Only business owner can disconnect integrations", 403);
    }

    return IntegrationRepository.update(businessId, platform, {
      is_connected: false,
      credentials: null,
      webhook_url: null,
    });
  },

  async getIntegrations(businessId: string) {
    return IntegrationRepository.findByBusiness(businessId);
  },

  async getActiveIntegration(platform: string) {
    // Useful for webhook handlers
    return IntegrationRepository.findOneByPlatform(platform);
  },
};
