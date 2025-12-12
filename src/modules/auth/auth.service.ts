// src/modules/auth/auth.service.ts
import bcrypt from "bcryptjs";
import { AuthUser } from "./auth.model";
import { Business } from "../businesses/business.model";
import UserBusiness from "../user-businesses/userBusiness.model";
import { ChatPreferenceModel } from "../chat-preferences/chatPreference.model";
import { generateBusinessCode } from "../../utils/generateBusinessCode";
import { signAccessToken } from "../../libs/jwt";
import { AuthRepository } from "./auth.repository";
import { UserBusinessRepository } from "../user-businesses/userBusiness.repository";

export const AuthService = {

  // BUSINESS SIGNUP
  registerBusiness: async (businessName, email, password) => {
    const exists = await AuthRepository.findByEmail(email);
    if (exists) throw new Error("Email already exists");

    const hashed = await bcrypt.hash(password, 10);

    const owner = await AuthRepository.createUser({
      email,
      password: hashed,
      full_name: businessName,
      user_type: "business_owner",
    });

    const businessCode = await generateBusinessCode();
    console.log("Generated business code:", businessCode);

    const business = await Business.create({
      business_name: businessName,
      email,
      business_code: businessCode,
      owner_user_id: owner._id,
    });

    console.log("Created business:", business);

    await UserBusinessRepository.add(owner._id.toString(), business._id.toString());

    console.log("Linked owner to business");

    // ✅ FIXED JWT PAYLOAD
    const token = signAccessToken({
      id: owner._id,
      email: owner.email,
      user_type: owner.user_type,
    });

    console.log("Generated token for owner");

    return { owner, business, token };
  },

  // BUSINESS LOGIN
  loginBusiness: async (email, password) => {
    const user = await AuthUser.findOne({ email });
    if (!user) throw new Error("Invalid credentials");
    if (user.user_type !== "business_owner")
      throw new Error("Not a business owner account");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    // ✅ FIXED JWT PAYLOAD
    const token = signAccessToken({
      id: user._id,
      email: user.email,
      user_type: user.user_type,
    });

    return { user, token };
  },

  // USER SIGNUP
  registerUser: async (fullName, email, password, businessCode) => {
    const exists = await AuthUser.findOne({ email });
    if (exists) throw new Error("Email already exists");

    const business = await Business.findOne({ business_code: businessCode });
    if (!business) throw new Error("Invalid business code");

    const hashed = await bcrypt.hash(password, 10);

    const user = await AuthUser.create({
      email,
      password: hashed,
      full_name: fullName,
      user_type: "user",
    });

    await UserBusiness.create({
      user_id: user._id,
      business_id: business._id,
    });

    await ChatPreferenceModel.create({
      user_id: user._id,
      business_id: business._id,
      use_ai_reply: true,
    });

    // ✅ FIXED JWT PAYLOAD
    const token = signAccessToken({
      id: user._id,
      email: user.email,
      user_type: user.user_type,
    });

    return { user, business, token };
  },

  // USER LOGIN
  loginUser: async (email, password) => {
    const user = await AuthUser.findOne({ email });
    if (!user) throw new Error("Invalid credentials");
    if (user.user_type !== "user") throw new Error("Not a user account");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    // ✅ FIXED JWT PAYLOAD
    const token = signAccessToken({
      id: user._id,
      email: user.email,
      user_type: user.user_type,
    });

    return { user, token };
  },
};
