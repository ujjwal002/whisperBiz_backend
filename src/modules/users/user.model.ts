import { Schema, model, Document } from "mongoose";
import { UserType } from "../../types";

export interface IUser extends Document {
  email: string;
  full_name?: string | null;
  user_type: UserType;
  platform?: string | null;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },  // removed index
    full_name: { type: String, default: null },
    user_type: {
      type: String,
      enum: Object.values(UserType),
      required: true
      // removed index
    },
    platform: {
      type: String,
      enum: ["web", "whatsapp", "telegram", "messenger"],
      default: "web",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// ❌ Remove these duplicate indices
// UserSchema.index({ email: 1 });
// UserSchema.index({ user_type: 1 });

export const User = model<IUser>("User", UserSchema);
