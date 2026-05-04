import { ChatMessageRepository } from "./chatMessage.repository";
import { ChatMessageModel } from "./chatMessage.model";

import { UserModel } from "../users/user.model";
import { MessagingIntegrationModel } from "../messaging-integrations/integration.model";
import { SendReply } from "../webhooks/helpers/sendReply";
import { Number } from "mongoose";

export const ChatMessageService = {
  async sendMessage(data: any) {
    // save in DB
    const saved = await ChatMessageRepository.create(data);
    console.log("Saving message:", saved);

    // fetch user
    const user = await UserModel.findById(data.user_id);

    if (!user) return saved;

    let platform = "";
    let externalUserId = "";

    if (user.email.includes("telegram_")) {
      platform = "telegram";
      externalUserId = user.email
        .replace("telegram_", "")
        .replace("@platform.local", "");
    } else if (user.email.includes("messenger_")) {
      platform = "messenger";
      externalUserId = user.email
        .replace("messenger_", "")
        .replace("@platform.local", "");
    } else if (user.email.includes("whatsapp_")) {
      platform = "whatsapp";
      externalUserId = user.email
        .replace("whatsapp_", "")
        .replace("@platform.local", "");
    }

    if (platform && externalUserId) {
      const integration = await MessagingIntegrationModel.findOne({
        business_id: data.business_id,
        platform,
      });

      const credentials = integration?.credentials;

      if (credentials) {
        console.log(`📤 Sending ${platform} message to`, externalUserId);

        await SendReply[platform](
          externalUserId,
          data.message,
          credentials
        );
      }
    }

    return saved;
  },

  async getConversation(userId: string, businessId: string) {
    console.log("📥 getConversation:", { userId, businessId });
    const messages = await ChatMessageModel.find({
      user_id: userId,
      business_id: businessId,
    })
      .sort({ createdAt: 1 })
      .lean();

    console.log("Fetched messages:", messages);

    return messages.map((m) => ({
      ...m,
      createdAt: m.created_at,
    }));

  },

  async getAllUsersWhoChatted(businessId: string) {
    console.log("📥 getAllUsersWhoChatted:", businessId);

    const users = await ChatMessageModel.aggregate([
      {
        $match: {
          business_id: businessId,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $group: {
          _id: "$user_id",
          lastMessage: { $first: "$message" },
          lastMessageTime: { $first: "$createdAt" },
          sender_type: { $first: "$sender_type" },
        },
      },
      {
        $addFields: {
          userObjectId: { $toObjectId: "$_id" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userObjectId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          userId: "$_id",
          full_name: "$user.full_name",
          email: "$user.email",
          platform: "$user.platform",
          lastMessage: 1,
          lastMessageTime: 1,
          sender_type: 1,
        },
      },
    ]);

    console.log("✅ Users:", users);

    return users;
  },


};
