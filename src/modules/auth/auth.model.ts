import mongoose, { Schema } from "mongoose";
import { UserType } from "../../types";

const AuthUserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    password_hash: { type: String, required: true },
    user_type: {
      type: String,
      enum: Object.values(UserType),
      default: UserType.BUSINESS_OWNER,
    },
    full_name: { type: String },
  },
  { timestamps: true }
);

export const AuthUser = mongoose.model("AuthUser", AuthUserSchema);
