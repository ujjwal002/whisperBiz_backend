// src/modules/businesses/business.schema.ts
import { z } from "zod";

export const getBusinessParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const updateBusinessSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    business_name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    // Add any other updatable fields here
    // Note: Do NOT allow owner_user_id or business_code edits via this payload
  }),
});
