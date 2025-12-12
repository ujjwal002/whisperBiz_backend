import { NormalizeMessage, NormalizedMessage } from "./normalizeMessage";
import { SendReply } from "./sendReply";

// Models (import existing modules)
import { UserModel } from "../../users/user.model";
import  UserBusinessModel  from "../../user-businesses/userBusiness.model";
import { ChatMessageModel } from "../../chat-messages/chatMessage.model";
import { ChatPreferenceModel } from "../../chat-preferences/chatPreference.model";
import { MessagingIntegrationModel } from "../../messaging-integrations/integration.model";

/**
 * processIncoming
 * - normalized: NormalizedMessage
 * - businessId: string (internal business id)
 */
export const WebhookProcessor = {
  async processIncoming(normalized: NormalizedMessage, businessId: string) {
    try {
      const { externalUserId, platform, message } = normalized;
      if (!externalUserId || !businessId) {
        console.warn("Missing externalUserId or businessId", { externalUserId, businessId });
        return null;
      }

      // 1) Find or create user
      const syntheticEmail = `${platform}_${externalUserId}@platform.local`;
      let user = await UserModel.findOne({ email: syntheticEmail }).lean();

      if (!user) {
        const created = await UserModel.create({
          email: syntheticEmail,
          full_name: null,
          user_type: "user",
          platform
        });
        user = created.toObject();
      }

      const userId = String(user._id);

      // 2) Link user to business (upsert)
      await UserBusinessModel.updateOne(
        { user_id: userId, business_id: businessId },
        { user_id: userId, business_id: businessId },
        { upsert: true }
      );

      // 3) Save incoming message
      const inbound = await ChatMessageModel.create({
        user_id: userId,
        business_id: businessId,
        message,
        sender_type: "user"
      });

      // 4) Check preference for AI replies
      const pref = await ChatPreferenceModel.findOne({ user_id: userId, business_id: businessId }).lean();
      const useAI = pref?.use_ai_reply ?? true;

      if (!useAI) return inbound;

      // 5) Generate AI reply (simple placeholder — replace with real AI call)
      const aiReply = await WebhookProcessor.generateAIReply(message, { user, businessId });

      // 6) Save AI message to DB
      const aiSaved = await ChatMessageModel.create({
        user_id: userId,
        business_id: businessId,
        message: aiReply,
        sender_type: "ai"
      });

      // 7) Send AI reply out via platform-specific API if integration exists
      const integration = await MessagingIntegrationModel.findOne({ business_id: businessId, platform }).lean();
      const credentials = integration?.credentials ?? null;

      try {
        await SendReply[platform](externalUserId, aiReply, credentials);
      } catch (err) {
        console.error("Outbound send failed", err);
      }

      return { inbound, ai: aiSaved };
    } catch (err) {
      console.error("WebhookProcessor error:", err);
      throw err;
    }
  },

  async generateAIReply(incomingText: string, ctx: any) {
    // TODO: Replace with real AI integration (OpenAI, local LLM, etc.)
    // Keep this small and cheap if you want to reduce cloud cost — use a cached prompt or rules.
    return `Auto reply: ${incomingText}`;
  }
};
