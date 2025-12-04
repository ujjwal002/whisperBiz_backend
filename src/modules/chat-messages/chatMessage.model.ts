import { Schema, model, Document } from "mongoose";
import { SenderType } from "../../types";

export interface IChatMessage extends Document {
  business_id: string;
  user_id: string;
  message: string;
  sender_type: SenderType; // "user" | "admin" | "ai"
  created_at: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    business_id: { type: String, required: true, index: true },
    user_id: { type: String, required: true, index: true },
    message: { type: String, required: true },
    sender_type: {
      type: String,
      enum: ["user", "admin", "ai"],
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

// helpful indexes for fast dashboards
ChatMessageSchema.index({ business_id: 1, created_at: -1 });
ChatMessageSchema.index({ user_id: 1, created_at: -1 });

export const ChatMessage = model<IChatMessage>("ChatMessage", ChatMessageSchema);
