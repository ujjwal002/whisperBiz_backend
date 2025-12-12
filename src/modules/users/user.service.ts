import { UserRepository } from "./user.repository";

export const UserService = {
  async getMe(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  },

  async getUser(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error("User not found");
    return user;
  },

  async listUsers() {
    return UserRepository.listAll();
  },

  async updateUser(id: string, data: any) {
    const updated = await UserRepository.update(id, data);
    if (!updated) throw new Error("Failed to update user");
    return updated;
  }
};
