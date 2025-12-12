import { Schema, model, Document } from "mongoose";

export interface IChatMessage extends Document {
  user_id: string;
  business_id: string;
  message: string;
  sender_type: "user" | "admin" | "ai";
  created_at: Date;
  updated_at: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    user_id: { type: String, required: true, index: true },
    business_id: { type: String, required: true, index: true },
    message: { type: String, required: true },
    sender_type: { type: String, enum: ["user", "admin", "ai"], required: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Performance indexes
ChatMessageSchema.index({ user_id: 1, created_at: 1 });
ChatMessageSchema.index({ business_id: 1 });

export const ChatMessageModel = model<IChatMessage>("ChatMessage", ChatMessageSchema);
