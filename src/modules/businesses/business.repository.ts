import { Business } from "./business.model";

export const BusinessRepository = {
  findById: (id: string) => Business.findById(id).lean(),

  findByOwner: (ownerId: string) =>
    Business.find({ owner_user_id: ownerId }).lean(),

  findByCode: (code: string) =>
    Business.findOne({ business_code: code }).lean(),

  findByEmail: (email: string) =>
    Business.findOne({ email }).lean(),

  create: (data: Partial<any>) => Business.create(data),

  update: (businessId: string, update: Partial<any>) =>
    Business.findByIdAndUpdate(businessId, update, { new: true }).lean(),
};
