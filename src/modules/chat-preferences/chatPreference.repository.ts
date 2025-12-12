import { ChatPreferenceModel } from "./chatPreference.model";

export const ChatPreferenceRepository = {
  createOrUpdate(user_id: string, business_id: string, use_ai_reply: boolean) {
    return ChatPreferenceModel.findOneAndUpdate(
      { user_id, business_id },
      { use_ai_reply },
      { upsert: true, new: true }
    );
  },

  get(user_id: string, business_id: string) {
    return ChatPreferenceModel.findOne({ user_id, business_id });
  }
};
