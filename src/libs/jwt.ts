import jwt from "jsonwebtoken";
import { Env } from "../config/env";

export const signAccessToken = (payload: any) => {
  return jwt.sign(payload, Env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: Env.ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const signRefreshToken = (payload: any) => {
  return jwt.sign(payload, Env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: Env.REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, Env.JWT_ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, Env.JWT_REFRESH_TOKEN_SECRET);
};
