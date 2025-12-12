import { z } from "zod";

export const addUserToBusinessSchema = z.object({
  user_id: z.string().min(1),
  business_id: z.string().min(1)
});

export const removeUserFromBusinessSchema = z.object({
  user_id: z.string().min(1),
  business_id: z.string().min(1)
});

export const listBusinessMembersSchema = z.object({
  businessId: z.string().min(1)
});
