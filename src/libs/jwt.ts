import * as jwt from "jsonwebtoken";
import { Env } from "../config/env";

export const signAccessToken = (payload: any) => {
  return jwt.sign(
    payload as string | Buffer | jwt.JwtPayload,
    Env.JWT_ACCESS_TOKEN_SECRET as jwt.Secret,
    {
      expiresIn: Env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    }
  ) as string;
};

export const signRefreshToken = (payload: any) => {
  return jwt.sign(
    payload as string | Buffer | jwt.JwtPayload,
    Env.JWT_REFRESH_TOKEN_SECRET as jwt.Secret,
    {
      expiresIn: Env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    }
  ) as string;
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, Env.JWT_ACCESS_TOKEN_SECRET as jwt.Secret) as any;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, Env.JWT_REFRESH_TOKEN_SECRET as jwt.Secret) as any;
};
