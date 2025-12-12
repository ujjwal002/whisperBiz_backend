import { ChatMessageModel } from "./chatMessage.model";

export const ChatMessageRepository = {
  create(data: any) {
    return ChatMessageModel.create(data);
  },

  listByUser(user_id: string, business_id: string) {
    return ChatMessageModel
      .find({ user_id, business_id })
      .sort({ created_at: 1 });
  },

  listUsersForBusiness(business_id: string) {
    return ChatMessageModel.distinct("user_id", { business_id });
  }
};
