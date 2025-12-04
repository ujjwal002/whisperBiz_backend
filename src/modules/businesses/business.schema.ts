import { z } from "zod";

export const createBusinessSchema = z.object({
  body: z.object({
    business_name: z.string().min(2),
    email: z.string().email(),
  }),
});

export const updateBusinessSchema = z.object({
  body: z.object({
    business_name: z.string().min(2).optional(),
    email: z.string().email().optional(),
  }),
});

export const getBusinessSchema = z.object({
  params: z.object({
    businessId: z.string().min(1),
  }),
});
