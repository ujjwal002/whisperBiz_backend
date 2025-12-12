// src/modules/auth/auth.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IAuthUser extends Document {
  email: string;
  password: string;
  full_name: string;
  user_type: "business_owner" | "user";
  platform?: string | null;
}

const AuthUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    user_type: { type: String, enum: ["business_owner", "user"], required: true },
    platform: { type: String, default: "web" },
  },
  { timestamps: true }
);

export const AuthUser = mongoose.model<IAuthUser>("AuthUser", AuthUserSchema);
