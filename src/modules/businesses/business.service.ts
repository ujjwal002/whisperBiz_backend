// src/modules/businesses/business.service.ts
import {Business} from "../businesses/business.model";
import UserBusiness from "../user-businesses/userBusiness.model";
import mongoose from "mongoose";

export class BusinessService {
  /**
   * Get business owned by the given owner id (first match)
   */
  static async getByOwner(ownerUserId: string) {
    return Business.findOne({ owner_user_id: ownerUserId }).lean();
  }

  /**
   * Get business by id (object id string)
   */
  static async getById(id: string) {
    if (!mongoose.isValidObjectId(id)) return null;
    return Business.findById(id).lean();
  }

  /**
   * Update business (only when owner matches)
   * @returns updated business or null if not found / unauthorized
   */
  static async updateByOwner(ownerUserId: string, businessId: string, update: Partial<any>) {
    if (!mongoose.isValidObjectId(businessId)) return null;
    const business = await Business.findOneAndUpdate(
      { _id: businessId, owner_user_id: ownerUserId },
      { $set: update },
      { new: true, runValidators: true }
    ).lean();
    return business;
  }

  /**
   * Verify if a user is a member of a business (useful for later)
   */
  static async isUserMemberOfBusiness(userId: string, businessId: string) {
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(businessId)) return false;
    const rel = await UserBusiness.findOne({ user_id: userId, business_id: businessId }).lean();
    return !!rel;
  }
}
