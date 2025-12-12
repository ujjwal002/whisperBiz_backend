import UserBusinessModel from "./userBusiness.model";

export const UserBusinessRepository = {
  add(user_id: string, business_id: string) {
    return UserBusinessModel.create({ user_id, business_id });
  },

  remove(user_id: string, business_id: string) {
    return UserBusinessModel.findOneAndDelete({ user_id, business_id });
  },

  list(business_id: string) {
    return UserBusinessModel
      .find({ business_id })
      .populate("user_id", "full_name email user_type");
  },

  findMembership(user_id: string, business_id: string) {
    return UserBusinessModel.findOne({ user_id, business_id });
  }
};
