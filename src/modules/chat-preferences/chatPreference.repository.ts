import { ChatPreference } from "./chatPreference.model";

export const ChatPreferenceRepository = {
  findByBusinessId: (businessId: string) =>
    ChatPreference.findOne({ business_id: businessId }).lean(),

  create: (data: Partial<any>) => ChatPreference.create(data),

  update: (businessId: string, update: Partial<any>) =>
    ChatPreference.findOneAndUpdate(
      { business_id: businessId },
      update,
      { new: true, upsert: true }
    ).lean(),
};
