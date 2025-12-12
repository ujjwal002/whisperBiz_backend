import mongoose, { Schema, Document } from "mongoose";

export interface IUserBusiness extends Document {
  user_id: mongoose.Types.ObjectId;
  business_id: mongoose.Types.ObjectId;
}

const UserBusinessSchema = new Schema<IUserBusiness>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    business_id: { type: Schema.Types.ObjectId, ref: "Business", required: true },
  },
  { timestamps: true }
);

// prevent duplicate membership
UserBusinessSchema.index({ user_id: 1, business_id: 1 }, { unique: true });

export default mongoose.model<IUserBusiness>("UserBusiness", UserBusinessSchema);
