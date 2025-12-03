import { ZodObject, ZodRawShape } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const validate = (schema: ZodObject<ZodRawShape>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (error: any) {
    next(new AppError(error.errors?.[0]?.message || "Invalid input", 400));
  }
};
