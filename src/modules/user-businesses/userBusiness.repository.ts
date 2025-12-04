import { UserBusiness } from "./userBusiness.model";

export const UserBusinessRepository = {
  findByUserAndBusiness: (userId: string, businessId: string) =>
    UserBusiness.findOne({ user_id: userId, business_id: businessId }).lean(),

  findByBusiness: (businessId: string, page = 1, limit = 50) =>
    UserBusiness.find({ business_id: businessId })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

  findByUser: (userId: string) => UserBusiness.find({ user_id: userId }).lean(),

  create: (data: Partial<any>) => UserBusiness.create(data),

  delete: (userId: string, businessId: string) =>
    UserBusiness.findOneAndDelete({ user_id: userId, business_id: businessId }),

  upsert: (userId: string, businessId: string, role?: string) =>
    UserBusiness.findOneAndUpdate(
      { user_id: userId, business_id: businessId },
      { $set: { role } },
      { upsert: true, new: true }
    ).lean(),
};
