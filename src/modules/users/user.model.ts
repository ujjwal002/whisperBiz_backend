import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash?: string | null;
  created_at: Date;
  updated_at: Date;
  role?: string;
  profile_id?: string; // link to profile._id
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String },
  role: { type: String, default: 'user' },
  profile_id: { type: String, default: null },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const User = model<IUser>('User', UserSchema);
