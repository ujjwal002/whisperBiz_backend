import { z } from "zod";

export const addUserToBusinessSchema = z.object({
  body: z.object({
    businessId: z.string().min(1),
    userId: z.string().min(1),
    role: z.string().optional(),
  }),
});

export const removeUserFromBusinessSchema = z.object({
  body: z.object({
    businessId: z.string().min(1),
    userId: z.string().min(1),
  }),
});

export const listBusinessMembersSchema = z.object({
  query: z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
  }),
});
