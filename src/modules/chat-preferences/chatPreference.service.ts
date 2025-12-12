import { ChatPreferenceRepository } from "./chatPreference.repository";

export const ChatPreferenceService = {
  async updatePreference(user_id: string, business_id: string, use_ai_reply: boolean) {
    return ChatPreferenceRepository.createOrUpdate(user_id, business_id, use_ai_reply);
  },

  async getPreference(userId: string, businessId: string) {
    const pref = await ChatPreferenceRepository.get(userId, businessId);

    if (!pref) {
      return { user_id: userId, business_id: businessId, use_ai_reply: true };
    }

    return pref;
  }
};
