import { Schema, model, Document } from 'mongoose';

export type UserType = 'business_owner' | 'user';
export type Platform = 'messenger' | 'whatsapp' | 'telegram' | 'web';

export interface IProfile extends Document {
  _id: string;
  email: string;
  full_name?: string | null;
  user_type: UserType;
  platform?: Platform | null;
  created_at: Date;
  updated_at: Date;
}

const ProfileSchema = new Schema<IProfile>({
  _id: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  full_name: { type: String, default: null },
  user_type: { type: String, enum: ['business_owner', 'user'], required: true },
  platform: { type: String, enum: ['messenger', 'whatsapp', 'telegram', 'web'], default: null },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Profile = model<IProfile>('Profile', ProfileSchema);
