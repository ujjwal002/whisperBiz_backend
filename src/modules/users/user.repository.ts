// src/modules/users/user.repository.ts
import { User, IUser } from "./user.model";

export const UserRepository = {
  findById: (id: string) => User.findById(id).lean(),
  findByEmail: (email: string) => User.findOne({ email }).lean(),
  find: (filter: any = {}, page = 1, limit = 20) =>
    User.find(filter).skip((page - 1) * limit).limit(limit).lean(),
  count: (filter: any = {}) => User.countDocuments(filter),
  create: (data: Partial<IUser>) => User.create(data),
  updateById: (id: string, data: Partial<IUser>) => User.findByIdAndUpdate(id, data, { new: true }).lean(),
  upsertByEmail: (email: string, data: Partial<IUser>) =>
    User.findOneAndUpdate({ email }, { $set: data }, { upsert: true, new: true }).lean(),
};
