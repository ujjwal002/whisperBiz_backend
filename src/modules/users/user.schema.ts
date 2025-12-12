import { z } from "zod";

export const updateUserSchema = z.object({
  full_name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  platform: z.string().optional(),
});

export const queryUsersSchema = z.object({
  businessId: z.string().optional(),
});
