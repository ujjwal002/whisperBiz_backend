import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (!req.user || req.user.user_type !== role) {
      return next(new AppError("Forbidden – insufficient permissions", 403));
    }

    next();
  };
};
