// src/modules/auth/auth.service.ts
import { UserRepository } from "../users/user.repository";
import { PasswordRepository } from "./password.repository";
import { hashPassword, comparePassword } from "../../libs/crypto";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../libs/jwt";
import { AppError } from "../../utils/appError";
import { UserType } from "../../types";

/**
 * Signup:
 *  - create User (user_type = business_owner by default for signups)
 *  - create PasswordCredential for that user
 *  - return tokens
 *
 * Login:
 *  - find user by email
 *  - find password credential
 *  - compare password
 *  - issue tokens
 *
 * Refresh:
 *  - verify refresh token
 *  - return new access token
 */

export const AuthService = {
  async signup(email: string, password: string, full_name?: string) {
    // Check if user exists
    const existing = await UserRepository.findByEmail(email);
    if (existing) throw new AppError("Email already registered", 400);

    // Create user
    const user = await UserRepository.create({
      email,
      full_name: full_name ?? null,
      user_type: UserType.BUSINESS_OWNER,
      platform: "web",
    } as any);

    // Create password credential
    const password_hash = await hashPassword(password);
    await PasswordRepository.create({ user_id: String((user as any)._id), password_hash });

    // Issue tokens
    const payload = { id: String((user as any)._id), email: user.email, user_type: user.user_type };
    const access_token = signAccessToken(payload);
    const refresh_token = signRefreshToken(payload);

    return { access_token, refresh_token, user };
  },

  async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new AppError("Invalid credentials", 400);

    const pw = await PasswordRepository.findByUserId(String((user as any)._id));
    if (!pw) throw new AppError("Invalid credentials", 400); // no password set for this user

    const ok = await comparePassword(password, pw.password_hash);
    if (!ok) throw new AppError("Invalid credentials", 400);

    const payload = { id: String((user as any)._id), email: user.email, user_type: user.user_type };
    const access_token = signAccessToken(payload);
    const refresh_token = signRefreshToken(payload);

    return { access_token, refresh_token, user };
  },

  async refresh(refreshToken: string) {
    try {
      const decoded: any = verifyRefreshToken(refreshToken);
      const userId = decoded.id;
      const user = await UserRepository.findById(userId);
      if (!user) throw new AppError("Invalid refresh token", 401);
      const payload = { id: String((user as any)._id), email: user.email, user_type: user.user_type };
      return { access_token: signAccessToken(payload) };
    } catch (err) {
      throw new AppError("Invalid refresh token", 401);
    }
  },

  // Optional: change password
  async changePassword(userId: string, newPassword: string) {
    const hash = await hashPassword(newPassword);
    const existing = await PasswordRepository.findByUserId(userId);
    if (existing) {
      await PasswordRepository.updateByUserId(userId, hash);
    } else {
      await PasswordRepository.create({ user_id: userId, password_hash: hash });
    }
    return true;
  },
};
