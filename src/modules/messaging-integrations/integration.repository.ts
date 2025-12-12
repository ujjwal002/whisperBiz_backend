import { MessagingIntegrationModel } from "./integration.model";

export const MessagingIntegrationRepository = {
  upsertIntegration(business_id: string, platform: string, credentials: any) {
    return MessagingIntegrationModel.findOneAndUpdate(
      { business_id, platform },
      { is_connected: true, credentials },
      { upsert: true, new: true }
    );
  },

  disconnect(business_id: string, platform: string) {
    return MessagingIntegrationModel.findOneAndUpdate(
      { business_id, platform },
      { is_connected: false },
      { new: true }
    );
  },

  getAll(business_id: string) {
    return MessagingIntegrationModel.find({ business_id });
  },

  getOne(business_id: string, platform: string) {
    return MessagingIntegrationModel.findOne({ business_id, platform });
  }
};


