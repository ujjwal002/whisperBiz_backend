import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    role: z.string().optional(),
    profile_id: z.string().optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    role: z.string().optional(),
    profile_id: z.string().optional(),
  }),
});

export const queryUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    email: z.string().optional(),
  }),
});
