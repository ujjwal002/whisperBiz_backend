import { z } from "zod";

export const sendMessageSchema = z.object({
  body: z.object({
    businessId: z.string().min(1),
    userId: z.string().min(1),
    message: z.string().min(1),
  }),
});

export const getUserMessagesSchema = z.object({
  params: z.object({
    userId: z.string().min(1),
    businessId: z.string().min(1),
  }),
  query: z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
  }),
});

export const getBusinessMessagesSchema = z.object({
  params: z.object({
    businessId: z.string().min(1),
  }),
  query: z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
  }),
});
