import { UserBusinessRepository } from "./userBusiness.repository";
import { BusinessRepository } from "../businesses/business.repository";
import { UserRepository } from "../users/user.repository";
import { AppError } from "../../utils/appError";

/**
 * Service responsibilities:
 * - add user to business (owner only or owner action)
 * - remove user from business (owner only)
 * - list members
 * - check membership / isOwner helper
 */

export const UserBusinessService = {
  async addUserToBusiness(requestingUserId: string, businessId: string, userId: string, role = "member") {
    // validate business exists
    const business = await BusinessRepository.findById(businessId);
    if (!business) throw new AppError("Business not found", 404);

    // Only owner can add members (owner_user_id on Business)
    if (String(business.owner_user_id) !== String(requestingUserId)) {
      throw new AppError("Only business owner can add members", 403);
    }

    // validate user exists
    const user = await UserRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    // create association (upsert to avoid race)
    try {
      const assoc = await UserBusinessRepository.upsert(userId, businessId, role);
      return assoc;
    } catch (err: any) {
      // Duplicate, return existing record or bubble up
      if (err?.code === 11000) {
        const existing = await UserBusinessRepository.findByUserAndBusiness(userId, businessId);
        return existing;
      }
      throw err;
    }
  },

  async removeUserFromBusiness(requestingUserId: string, businessId: string, userId: string) {
    const business = await BusinessRepository.findById(businessId);
    if (!business) throw new AppError("Business not found", 404);

    if (String(business.owner_user_id) !== String(requestingUserId)) {
      throw new AppError("Only business owner can remove members", 403);
    }

    // Prevent owner from removing themselves — prevent orphan business
    if (String(business.owner_user_id) === String(userId)) {
      throw new AppError("Owner cannot be removed", 400);
    }

    const removed = await UserBusinessRepository.delete(userId, businessId);
    return removed;
  },

  async listMembers(requestingUserId: string, businessId: string, page = 1, limit = 50) {
    const business = await BusinessRepository.findById(businessId);
    if (!business) throw new AppError("Business not found", 404);

    // Only owner or members can list members
    const isOwner = String(business.owner_user_id) === String(requestingUserId);
    const isMember = !!(await UserBusinessRepository.findByUserAndBusiness(requestingUserId, businessId));
    if (!isOwner && !isMember) throw new AppError("Forbidden", 403);

    const members = await UserBusinessRepository.findByBusiness(businessId, page, limit);
    return members;
  },

  async isUserInBusiness(userId: string, businessId: string) {
    const existing = await UserBusinessRepository.findByUserAndBusiness(userId, businessId);
    return !!existing;
  },

  async ensureUserBelongsToBusiness(userId: string, businessId: string, role = "member") {
    // idempotent upsert used by webhooks when creating system users
    return UserBusinessRepository.upsert(userId, businessId, role);
  },
};
