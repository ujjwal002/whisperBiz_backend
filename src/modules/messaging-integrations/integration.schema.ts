import { z } from "zod";

export const connectPlatformSchema = z.object({
  body: z.object({
    businessId: z.string().min(1),
    platform: z.enum(["whatsapp", "telegram", "messenger"]),
    credentials: z.record(z.any()).optional(),
    webhook_url: z.string().url().optional(),
  }),
});

export const disconnectPlatformSchema = z.object({
  body: z.object({
    businessId: z.string().min(1),
    platform: z.enum(["whatsapp", "telegram", "messenger"]),
  }),
});
