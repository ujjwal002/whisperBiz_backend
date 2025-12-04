import { BusinessRepository } from "./business.repository";
import { generateBusinessCode } from "../../utils/generateBusinessCode";
import { UserBusinessService } from "../user-businesses/userBusiness.service";
import { AppError } from "../../utils/appError";

export const BusinessService = {
  async createBusiness(ownerUserId: string, business_name: string, email: string) {
    // Ensure email not used
    const existing = await BusinessRepository.findByEmail(email);
    if (existing) throw new AppError("Business email already exists", 400);

    // Unique business code
    let business_code = await generateBusinessCode();
    while (await BusinessRepository.findByCode(business_code)) {
      business_code = await generateBusinessCode();
    }

    const business = await BusinessRepository.create({
      business_name,
      email,
      business_code,
      owner_user_id: ownerUserId,
    });

    // Owner should automatically belong to business
    await UserBusinessService.ensureUserBelongsToBusiness(ownerUserId, business._id.toString(), "owner");

    return business;
  },

  async updateBusiness(requestingUserId: string, businessId: string, update: any) {
    const business = await BusinessRepository.findById(businessId);
    if (!business) throw new AppError("Business not found", 404);

    if (String(business.owner_user_id) !== String(requestingUserId)) {
      throw new AppError("Only owner can update business", 403);
    }

    return BusinessRepository.update(businessId, update);
  },

  async getBusiness(requestingUserId: string, businessId: string) {
    const business = await BusinessRepository.findById(businessId);
    if (!business) throw new AppError("Business not found", 404);

    const belongs = await UserBusinessService.isUserInBusiness(requestingUserId, businessId);
    if (!belongs) throw new AppError("Forbidden", 403);

    return business;
  },

  async getBusinessesForUser(userId: string) {
    return BusinessRepository.findByOwner(userId);
  },
};
