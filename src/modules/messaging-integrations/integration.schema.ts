import { z } from "zod";

export const connectIntegrationSchema = z.object({
  businessId: z.string(),
  platform: z.enum(["whatsapp", "telegram", "messenger"]),
  credentials: z.record(z.string(), z.any()).optional()
});

export const disconnectIntegrationSchema = z.object({
  business_id: z.string(),
  platform: z.enum(["whatsapp", "telegram", "messenger"])
});
