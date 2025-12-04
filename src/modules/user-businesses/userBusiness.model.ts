import { Schema, model, Document } from "mongoose";

export interface IUserBusiness extends Document {
  user_id: string;     // User._id
  business_id: string; // Business._id
  role?: string;       // e.g., "owner", "admin", "member"
  created_at: Date;
}

const UserBusinessSchema = new Schema<IUserBusiness>(
  {
    user_id: { type: String, required: true, index: true },
    business_id: { type: String, required: true, index: true },
    role: { type: String, default: "member" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

// Unique constraint: a user can join a business only once
UserBusinessSchema.index({ user_id: 1, business_id: 1 }, { unique: true });

export const UserBusiness = model<IUserBusiness>("UserBusiness", UserBusinessSchema);
