import { AuthUser } from "./auth.model";

export const AuthRepository = {
  findByEmail: (email: string) => AuthUser.findOne({ email }),

  createUser: (data: {
    email: string;
    password: string;
    full_name?: string;
    user_type: string;
  }) => AuthUser.create(data),
};
