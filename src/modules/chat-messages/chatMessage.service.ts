import { ChatMessageRepository } from "./chatMessage.repository";

export const ChatMessageService = {
  async sendMessage(data: any) {
    return ChatMessageRepository.create(data);
  },

  async getConversation(userId: string, businessId: string) {
    return ChatMessageRepository.listByUser(userId, businessId);
  },

  async getAllUsersWhoChatted(businessId: string) {
    return ChatMessageRepository.listUsersForBusiness(businessId);
  }
};
