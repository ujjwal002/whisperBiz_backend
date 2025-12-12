import { Schema, model, Document } from "mongoose";

export interface IMessagingIntegration extends Document {
  business_id: string;
  platform: "whatsapp" | "telegram" | "messenger";
  is_connected: boolean;
  credentials: any;
  created_at: Date;
  updated_at: Date;
}

const MessagingIntegrationSchema = new Schema<IMessagingIntegration>(
  {
    business_id: { type: String, required: true, index: true },
    platform: { type: String, enum: ["whatsapp", "telegram", "messenger"], required: true },
    is_connected: { type: Boolean, default: false },
    credentials: { type: Schema.Types.Mixed }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// One integration per platform per business
MessagingIntegrationSchema.index({ business_id: 1, platform: 1 }, { unique: true });

export const MessagingIntegrationModel = model<IMessagingIntegration>(
  "MessagingIntegration",
  MessagingIntegrationSchema
);
