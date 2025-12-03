// src/modules/auth/password.repository.ts
import { PasswordCredential, IPasswordCredential } from "./password.model";

export const PasswordRepository = {
  findByUserId: (userId: string) => PasswordCredential.findOne({ user_id: userId }).lean(),
  create: (data: { user_id: string; password_hash: string }) =>
    PasswordCredential.create(data),
  updateByUserId: (userId: string, password_hash: string) =>
    PasswordCredential.findOneAndUpdate({ user_id: userId }, { $set: { password_hash } }, { new: true }).lean(),
  deleteByUserId: (userId: string) => PasswordCredential.findOneAndDelete({ user_id: userId }),
};
