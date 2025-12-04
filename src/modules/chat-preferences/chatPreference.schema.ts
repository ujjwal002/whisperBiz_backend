import { z } from "zod";

export const updateChatPreferenceSchema = z.object({
  body: z.object({
    businessId: z.string().min(1),
    use_ai_reply: z.boolean(),
  }),
});

export const getChatPreferenceSchema = z.object({
  params: z.object({
    businessId: z.string().min(1),
  }),
});
