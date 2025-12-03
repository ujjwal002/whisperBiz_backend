import { AuthRepository } from "./auth.repository";
import { hashPassword, comparePassword } from "../../libs/crypto";
import {
  signAccessToken,
  signRefreshToken,
} from "../../libs/jwt";
import { AppError } from "../../utils/appError";
import { UserType } from "../../types";

export const AuthService = {
  async signup(email: string, password: string, full_name?: string) {
    const existing = await AuthRepository.findByEmail(email);
    if (existing) throw new AppError("Email already registered", 400);

    const password_hash = await hashPassword(password);

    const user = await AuthRepository.createUser({
      email,
      password_hash,
      full_name,
      user_type: UserType.BUSINESS_OWNER,
    });

    const payload = {
      id: user._id.toString(),
      email: user.email,
      user_type: user.user_type,
    };

    return {
      access_token: signAccessToken(payload),
      refresh_token: signRefreshToken(payload),
      user,
    };
  },

  async login(email: string, password: string) {
    const user = await AuthRepository.findByEmail(email);
    if (!user) throw new AppError("Invalid credentials", 400);

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) throw new AppError("Invalid credentials", 400);

    const payload = {
      id: user._id.toString(),
      email: user.email,
      user_type: user.user_type,
    };

    return {
      access_token: signAccessToken(payload),
      refresh_token: signRefreshToken(payload),
      user,
    };
  },

  async refresh(refreshToken: string) {
    try {
      const decoded: any = await signRefreshToken(refreshToken);

      const user = await AuthRepository.findByEmail(decoded.email);
      if (!user) throw new AppError("Invalid refresh token", 401);

      const payload = {
        id: user._id.toString(),
        email: user.email,
        user_type: user.user_type,
      };

      return {
        access_token: signAccessToken(payload),
      };
    } catch {
      throw new AppError("Invalid refresh token", 401);
    }
  },
};
