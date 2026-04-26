// src/modules/businesses/business.service.ts
import mongoose from "mongoose";
import { BusinessRepository } from "./business.repository";
import UserBusiness from "../user-businesses/userBusiness.model";

export class BusinessService {
  static async getMyBusiness(ownerUserId: string) {
    return BusinessRepository.findByOwner(ownerUserId);
  }

  static async getById(businessId: string) {
    if (!mongoose.isValidObjectId(businessId)) return null;
    return BusinessRepository.findById(businessId);
  }

  static async updateBusiness(
    ownerUserId: string,
    businessId: string,
    update: Partial<any>
  ) {
    if (!mongoose.isValidObjectId(businessId)) return null;

    // extra safety
    delete update.owner_user_id;
    delete update.business_code;
    delete update._id;

    return BusinessRepository.updateByOwner(
      ownerUserId,
      businessId,
      update
    );
  }

  static async isUserMember(userId: string, businessId: string) {
    if (
      !mongoose.isValidObjectId(userId) ||
      !mongoose.isValidObjectId(businessId)
    )
      return false;

    const rel = await UserBusiness.findOne({
      user_id: userId,
      business_id: businessId,
    }).lean();

    return !!rel;
  }
}
