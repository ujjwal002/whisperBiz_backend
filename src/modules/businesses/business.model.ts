import { Schema, model, Document } from 'mongoose';

export interface IBusiness extends Document {
  business_code: string;
  business_name: string;
  email: string;
  owner_user_id?: string | null;
  created_at: Date;
  updated_at: Date;
}

const BusinessSchema = new Schema<IBusiness>({
  business_code: { type: String, required: true, unique: true, index: true },
  business_name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  owner_user_id: { type: String, default: null },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Business = model<IBusiness>('Business', BusinessSchema);
