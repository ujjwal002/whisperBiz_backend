// src/modules/users/user.model.ts
import { Schema, model, Document } from "mongoose";
import { UserType } from "../../types";

export interface IUser extends Document {
  email: string;
  full_name?: string | null;
  user_type: UserType;
  platform?: string | null;
  profile_id?: string | null;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    full_name: { type: String, default: null },
    user_type: { type: String, enum: Object.values(UserType), required: true, index: true },
    platform: { type: String, default: "web" },
    profile_id: { type: String, default: null }, // optional link to a "profile" record if you keep separate profiles
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Helpful indexes
UserSchema.index({ email: 1 });
UserSchema.index({ user_type: 1 });

export const User = model<IUser>("User", UserSchema);
