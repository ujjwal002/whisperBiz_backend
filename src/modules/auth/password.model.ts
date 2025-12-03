// src/modules/auth/password.model.ts
import { Schema, model, Document } from "mongoose";

export interface IPasswordCredential extends Document {
  user_id: string; // references User._id (string)
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

const PasswordCredentialSchema = new Schema<IPasswordCredential>(
  {
    user_id: { type: String, required: true, index: true, unique: true }, // one password credential per user
    password_hash: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const PasswordCredential = model<IPasswordCredential>("PasswordCredential", PasswordCredentialSchema);
