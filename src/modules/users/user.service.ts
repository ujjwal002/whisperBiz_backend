import { UserRepository } from "./user.repository";

export const UserService = {
  async getMe(userId: string) {
    console.log("UserService.getMe - Fetching user with ID:", userId);
    const user = await UserRepository.findById(userId);
    console.log("UserService.getMe - Retrieved User:", user);
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
