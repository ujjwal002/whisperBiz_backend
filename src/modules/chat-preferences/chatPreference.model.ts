import { Schema, model, Document } from "mongoose";

export interface IChatPreference extends Document {
  user_id: string;
  business_id: string;
  use_ai_reply: boolean;
  created_at: Date;
  updated_at: Date;
}

const ChatPreferenceSchema = new Schema<IChatPreference>(
  {
    user_id: { type: String, required: true, index: true },
    business_id: { type: String, required: true, index: true },
    use_ai_reply: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Ensure one preference per (user + business)
ChatPreferenceSchema.index({ user_id: 1, business_id: 1 }, { unique: true });

export const ChatPreferenceModel = model<IChatPreference>(
  "ChatPreference",
  ChatPreferenceSchema
);
