import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../libs/jwt";
import { AppError } from "../utils/appError";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new AppError("Unauthorized", 401);

    const token = authHeader.split(" ")[1];
    if (!token) throw new AppError("Unauthorized", 401);

    const decoded = verifyAccessToken(token);
    // @ts-ignore
    req.user = decoded;

    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};
