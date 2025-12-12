import { UserModel } from "./user.model";

export const UserRepository = {
  create(data: any) {
    return UserModel.create(data);
  },

  findByEmail(email: string) {
    return UserModel.findOne({ email });
  },

  findById(id: string) {
    return UserModel.findById(id);
  },

  update(id: string, data: any) {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  },

  listAll() {
    return UserModel.find().select("-password");
  },

  listByIds(ids: string[]) {
    return UserModel.find({ _id: { $in: ids } }).select("-password");
  }
};
