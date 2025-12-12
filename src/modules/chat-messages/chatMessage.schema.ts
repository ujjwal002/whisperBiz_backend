import { z } from "zod";

export const sendMessageSchema = z.object({
  user_id: z.string(),
  business_id: z.string(),
  message: z.string().min(1),
  sender_type: z.enum(["user", "admin", "ai"])
});

export const getMessagesSchema = z.object({
  userId: z.string(),
  businessId: z.string()
});
