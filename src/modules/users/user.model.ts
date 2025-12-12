import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  full_name: string;
  email: string;
  password?: string; // hashed
  user_type: "user" | "business_owner";
  platform?: string | null;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String }, // only for internal login
    user_type: {
      type: String,
      enum: ["user", "business_owner"],
      default: "user"
    },
    platform: { type: String, default: "web" }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const UserModel = model<IUser>("User", UserSchema);
