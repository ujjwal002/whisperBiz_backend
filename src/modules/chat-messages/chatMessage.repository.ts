import { ChatMessage } from "./chatMessage.model";

export const ChatMessageRepository = {
  create: (data: Partial<any>) => ChatMessage.create(data),

  findByBusiness: (businessId: string, page = 1, limit = 50) =>
    ChatMessage.find({ business_id: businessId })
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

  findByUserAndBusiness: (userId: string, businessId: string, page = 1, limit = 50) =>
    ChatMessage.find({ business_id: businessId, user_id: userId })
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

  deleteByUser: (userId: string) => ChatMessage.deleteMany({ user_id: userId }),
};
