import { ZodObject, ZodRawShape } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      next(new AppError(error.errors?.[0]?.message || "Invalid input", 400));
    }
  };

