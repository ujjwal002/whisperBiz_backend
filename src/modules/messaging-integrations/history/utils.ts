// src/modules/messaging-integrations/history/utils.ts
import { UserModel } from "../../../modules/users/user.model";
import  UserBusinessModel  from "../../../modules/user-businesses/userBusiness.model";
import { ChatMessageModel } from "../../../modules/chat-messages/chatMessage.model";
import { MessagingIntegrationModel } from "../../../modules/messaging-integrations/integration.model";

/**
 * Ensure platform synthetic user exists. Returns user document (mongoose).
 */
export async function ensurePlatformUser(
  platform: string,
  externalId: string,
  displayName?: string
) {
  const syntheticEmail = `${platform}_${externalId}@platform.local`;

  let user = await UserModel.findOne({ email: syntheticEmail });

  const safeName =
  displayName && displayName.trim() !== ""
    ? displayName
    : `Messenger User ${externalId.slice(-4)}`;  // fallback

  if (!user) {
    user = await UserModel.create({
      email: syntheticEmail,
      full_name: safeName,
      user_type: "user",
      platform,
    });
  } else {
    // optional: update user name only if it's missing or default
    if (!user.full_name || user.full_name.startsWith("Messenger User")) {
      user.full_name = safeName;
      await user.save();
    }
  }

  return user;
}



/**
 * Link user to business (upsert)
 */
export async function linkUserToBusiness(userId: string, businessId: string) {
  await UserBusinessModel.updateOne(
    { user_id: userId, business_id: businessId },
    { user_id: userId, business_id: businessId, created_at: new Date() },
    { upsert: true }
  );
}

/**
 * Save a chat message if not duplicate (simple dedupe using platform message id + platform)
 *
 * messageObj contains:
 *  - externalId: platform message id (string)
 *  - userId: internal user id (string)
 *  - businessId: string
 *  - message: string
 *  - sender_type: 'user'|'admin'|'ai'
 *  - created_at: Date
 *  - platform: string
 */
export async function saveMessageIfNotExists(messageObj: {
  externalId?: string;
  userId: string;
  businessId: string;
  message: string;
  sender_type?: 'user' | 'admin' | 'ai';
  created_at?: Date;
  platform: string;
}) {
  const { externalId, businessId, userId, platform } = messageObj as any;
  // If platform+externalId exists, skip
  if (externalId) {
    const exists = await ChatMessageModel.findOne({
      'meta.platform': platform,
      'meta.externalId': externalId,
      business_id: businessId,
      user_id: userId,
    }).lean();

    if (exists) return null;
  }

  const doc = await ChatMessageModel.create({
    business_id: messageObj.businessId,
    user_id: messageObj.userId,
    message: messageObj.message,
    sender_type: messageObj.sender_type ?? 'user',
    created_at: messageObj.created_at ?? new Date(),
    meta: {
      platform: messageObj.platform,
      externalId: messageObj.externalId ?? null
    }
  });

  return doc;
}

/**
 * Get integration credentials for a business+platform
 */
export async function getIntegrationCredentials(businessId: string, platform: string) {
  const integration = await MessagingIntegrationModel.findOne({ business_id: businessId, platform }).lean();
  return integration?.credentials ?? null;
}
