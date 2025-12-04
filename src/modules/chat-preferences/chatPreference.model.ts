import { Schema, model, Document } from "mongoose";

export interface IChatPreference extends Document {
  business_id: string;
  user_id: string; // business owner
  use_ai_reply: boolean;
  created_at: Date;
  updated_at: Date;
}

const ChatPreferenceSchema = new Schema<IChatPreference>(
  {
    business_id: { type: String, required: true, index: true },
    user_id: { type: String, required: true, index: true },
    use_ai_reply: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Unique: 1 preference per business
ChatPreferenceSchema.index({ business_id: 1 }, { unique: true });

export const ChatPreference = model<IChatPreference>("ChatPreference", ChatPreferenceSchema);
