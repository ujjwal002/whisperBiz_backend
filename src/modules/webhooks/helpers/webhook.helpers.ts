import { UserRepository } from "../../users/user.repository";
import { UserBusinessService } from "../../user-businesses/userBusiness.service";
import { ChatMessageService } from "../../chat-messages/chatMessage.service";
import { UserType } from "../../../types";

export const findOrCreatePlatformUser = async (
  businessId: string,
  platform: "whatsapp" | "telegram" | "messenger",
  externalId: string,
  name?: string
) => {
  const email = `${platform}_${externalId}@placeholder.com`;

  let user = await UserRepository.findByEmail(email);
  if (!user) {
    const created = await UserRepository.create({
      email,
      full_name: name || `User ${externalId}`,
      user_type: UserType.USER,
      platform,
    });
    // convert mongoose Document to plain object to match IUser / FlattenMaps<IUser>
    user = created.toObject() as any;
  }

  // Ensure user is linked to the business
  if (!user) {
    throw new Error("Failed to find or create user");
  }
  await UserBusinessService.ensureUserBelongsToBusiness(user._id.toString(), businessId);

  return user;
};

export const saveIncomingMessage = async (
  businessId: string,
  userId: string,
  message: string
) => {
  return ChatMessageService.storeIncomingUserMessage(businessId, userId, message, "user");
};
