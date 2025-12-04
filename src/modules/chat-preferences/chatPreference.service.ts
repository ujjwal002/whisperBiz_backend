import { ChatPreferenceRepository } from "./chatPreference.repository";
import { BusinessRepository } from "../businesses/business.repository";
import { AppError } from "../../utils/appError";

export const ChatPreferenceService = {
  async updatePreference(requestingUserId: string, businessId: string, use_ai_reply: boolean) {
    const business = await BusinessRepository.findById(businessId);
    if (!business) throw new AppError("Business not found", 404);

    // Only owner can change preferences
    if (String(business.owner_user_id) !== String(requestingUserId)) {
      throw new AppError("Only business owner can update preferences", 403);
    }

    return ChatPreferenceRepository.update(businessId, { user_id: requestingUserId, use_ai_reply });
  },

  async getPreference(businessId: string) {
    const pref = await ChatPreferenceRepository.findByBusinessId(businessId);

    // If no preferences exist yet, create defaults
    if (!pref) {
      return {
        business_id: businessId,
        use_ai_reply: true,
      };
    }
    return pref;
  },

  async shouldUseAI(businessId: string) {
    const pref = await ChatPreferenceRepository.findByBusinessId(businessId);
    return pref?.use_ai_reply ?? true;
  },
};
