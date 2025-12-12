import { UserBusinessRepository } from "./userBusiness.repository";

export const UserBusinessService = {
  async addMember(user_id: string, business_id: string) {
    // check if already exists
    const exists = await UserBusinessRepository.findMembership(user_id, business_id);
    if (exists) {
      throw new Error("This user is already added to this business");
    }

    return UserBusinessRepository.add(user_id, business_id);
  },

  async removeMember(user_id: string, business_id: string) {
    return UserBusinessRepository.remove(user_id, business_id);
  },

  async listMembers(business_id: string) {
    return UserBusinessRepository.list(business_id);
  }
};
