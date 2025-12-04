import { Schema, model, Document } from "mongoose";

export interface IIntegration extends Document {
  business_id: string;
  platform: "whatsapp" | "telegram" | "messenger";
  is_connected: boolean;
  credentials: Record<string, any> | null;
  webhook_url?: string | null;
  created_at: Date;
  updated_at: Date;
}

const IntegrationSchema = new Schema<IIntegration>(
  {
    business_id: { type: String, required: true, index: true },
    platform: {
      type: String,
      enum: ["whatsapp", "telegram", "messenger"],
      required: true,
      index: true,
    },
    is_connected: { type: Boolean, default: false },
    credentials: { type: Object, default: null },
    webhook_url: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// 1 integration per business per platform
IntegrationSchema.index({ business_id: 1, platform: 1 }, { unique: true });

export const Integration = model<IIntegration>("Integration", IntegrationSchema);
