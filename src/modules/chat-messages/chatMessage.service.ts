import { ChatMessageRepository } from "./chatMessage.repository";
import { UserBusinessService } from "../user-businesses/userBusiness.service";
import { AppError } from "../../utils/appError";

export const ChatMessageService = {
  async sendAdminMessage(requestingUserId: string, businessId: string, userId: string, message: string) {
    // Admin (business owner) or team member can reply only if they belong to this business
    const belongs = await UserBusinessService.isUserInBusiness(requestingUserId, businessId);
    if (!belongs) throw new AppError("Not authorized to send messages", 403);

    return ChatMessageRepository.create({
      business_id: businessId,
      user_id: userId,
      message,
      sender_type: "admin",
    });
  },

  async storeIncomingUserMessage(businessId: string, userId: string, message: string, sender_type: "user" | "ai") {
    return ChatMessageRepository.create({
      business_id: businessId,
      user_id: userId,
      message,
      sender_type,
    });
  },

  async getMessagesForUser(userId: string, businessId: string, page = 1, limit = 50) {
    return ChatMessageRepository.findByUserAndBusiness(userId, businessId, page, limit);
  },

  async getMessagesForBusiness(requestingUserId: string, businessId: string, page = 1, limit = 50) {
    const belongs = await UserBusinessService.isUserInBusiness(requestingUserId, businessId);
    if (!belongs) throw new AppError("Not authorized", 403);

    return ChatMessageRepository.findByBusiness(businessId, page, limit);
  },
};
