import { ChatMessageModel } from "../../chat-messages/chatMessage.model";

export async function fetchTelegramHistory(businessId: string) {
  try {
    console.log("📥 fetchTelegramHistory called");
    console.log("🏢 businessId:", businessId);

    const messages = await ChatMessageModel.find({
      business_id: businessId,
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    console.log("✅ Messages fetched:", messages.length);

    if (messages.length > 0) {
      console.log("📝 First message:", messages[0]);
    } else {
      console.log("⚠️ No messages found in DB");
    }

    return {
      success: true,
      imported: messages.length,
      rawCount: messages.length,
      messages,
    };
  } catch (error: any) {
    console.error("❌ Error in fetchTelegramHistory:");
    console.error(error);
    console.error(error?.message);
    console.error(error?.stack);
    throw error;
  }
}