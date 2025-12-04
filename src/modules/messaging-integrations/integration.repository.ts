import { Integration } from "./integration.model";

export const IntegrationRepository = {
  findByBusinessAndPlatform: (businessId: string, platform: string) =>
    Integration.findOne({ business_id: businessId, platform }).lean(),

  findByBusiness: (businessId: string) =>
    Integration.find({ business_id: businessId }).lean(),

  findOneByPlatform: (platform: string) =>
    Integration.findOne({ platform, is_connected: true }).lean(),

  create: (data: Partial<any>) => Integration.create(data),

  update: (businessId: string, platform: string, update: any) =>
    Integration.findOneAndUpdate(
      { business_id: businessId, platform },
      update,
      { new: true, upsert: true }
    ).lean(),

  delete: (businessId: string, platform: string) =>
    Integration.findOneAndDelete({ business_id: businessId, platform }),
};
