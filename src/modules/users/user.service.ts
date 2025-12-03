// src/modules/users/user.service.ts
import { UserRepository } from "./user.repository";
import { AppError } from "../../utils/appError";

export const UserService = {
  async createUser(payload: { email: string; role?: string; profile_id?: string; full_name?: string; user_type?: any }) {
    const existing = await UserRepository.findByEmail(payload.email);
    if (existing) throw new AppError("User with this email already exists", 400);
    const user = await UserRepository.create(payload as any);
    return user;
  },

  async getUserById(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    return user;
  },

  async getUsers(query: { page?: number; limit?: number; email?: string }) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const filter: any = {};
    if (query.email) filter.email = { $regex: query.email, $options: "i" };
    const [items, total] = await Promise.all([
      UserRepository.find(filter, page, limit),
      UserRepository.count(filter),
    ]);
    return { items, total, page, limit };
  },

  async updateUser(userId: string, payload: Partial<{ email: string; role: string; profile_id: string; full_name?: string }>) {
    const user = await UserRepository.updateById(userId, payload as any);
    if (!user) throw new AppError("User not found", 404);
    return user;
  },

  async linkProfile(userId: string, profileId: string) {
    const user = await UserRepository.updateById(userId, { profile_id: profileId } as any);
    if (!user) throw new AppError("User not found", 404);
    return user;
  },

  async ensureSystemUser(email: string, profile_id?: string) {
    const user = await UserRepository.upsertByEmail(email, { profile_id, user_type: "user" } as any);
    return user;
  },
};
