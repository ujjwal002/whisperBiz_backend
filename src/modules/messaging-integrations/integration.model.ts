import { Schema, model, Document } from "mongoose";

export interface IMessagingIntegration extends Document {
  business_id: string;
  platform: "whatsapp" | "telegram" | "messenger";
  is_connected: boolean;

  credentials: {
    // WhatsApp
    apiKey?: string;
    phoneNumber?: string;

    // Telegram
    botToken?: string;

    // Messenger OAuth
    pageId?: string;
    pageName?: string;
    pageAccessToken?: string;
    longLivedUserToken?: string;

    pageAccessTokenExpiresAt?: Date;     // NEW
    longLivedUserTokenExpiresAt?: Date;  // NEW

    rawPages?: any[];

    [key: string]: any;
  };

  created_at: Date;
  updated_at: Date;
}


const MessagingIntegrationSchema = new Schema<IMessagingIntegration>(
  {
    business_id: { type: String, required: true, index: true },

    platform: {
      type: String,
      enum: ["whatsapp", "telegram", "messenger"],
      required: true,
    },

    is_connected: { type: Boolean, default: false },

    credentials: {
      type: Schema.Types.Mixed,
      default: {
        pageAccessTokenExpiresAt: null,
        longLivedUserTokenExpiresAt: null,
      },
    },
  },

  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// one record per business + platform
MessagingIntegrationSchema.index({ business_id: 1, platform: 1 }, { unique: true });

export const MessagingIntegrationModel = model<IMessagingIntegration>(
  "MessagingIntegration",
  MessagingIntegrationSchema
);
