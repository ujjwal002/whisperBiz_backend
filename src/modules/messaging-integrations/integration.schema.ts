import { z } from "zod";

export const connectIntegrationSchema = z.object({
  businessId: z.string(),

  platform: z.enum(["whatsapp", "telegram", "messenger"]),

  credentials: z.object({
    // whatsapp
    apiKey: z.string().optional(),
    phoneNumber: z.string().optional(),

    // telegram
    botToken: z.string().optional(),

    // messenger (OAuth)
    pageId: z.string().optional(),
    pageName: z.string().optional(),
    pageAccessToken: z.string().optional(),
    longLivedUserToken: z.string().optional(),
    pageAccessTokenExpiresAt: z.string().optional(),
    longLivedUserTokenExpiresAt: z.string().optional(),
  }).optional(),
});


export const disconnectIntegrationSchema = z.object({
  businessId: z.string(),
  platform: z.enum(["whatsapp", "telegram", "messenger"])
});
