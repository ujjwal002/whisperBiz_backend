// src/modules/businesses/business.repository.ts
import { Business } from "./business.model";

export const BusinessRepository = {
  findById: (id: string) => Business.findById(id).lean(),

  findByOwner: (ownerId: string) =>
    Business.findOne({ owner_user_id: ownerId }).lean(),

  findByCode: (code: string) =>
    Business.findOne({ business_code: code }).lean(),

  create: (data: Partial<any>) => Business.create(data),

  updateByOwner: (
    ownerId: string,
    businessId: string,
    update: Partial<any>
  ) =>
    Business.findOneAndUpdate(
      { _id: businessId, owner_user_id: ownerId },
      { $set: update },
      { new: true, runValidators: true }
    ).lean(),
};
