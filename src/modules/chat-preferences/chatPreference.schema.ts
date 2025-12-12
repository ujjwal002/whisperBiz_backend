import { z } from "zod";

export const updatePreferenceSchema = z.object({
  user_id: z.string(),
  business_id: z.string(),
  use_ai_reply: z.boolean()
});

export const getPreferenceSchema = z.object({
  userId: z.string(),
  businessId: z.string()
});
