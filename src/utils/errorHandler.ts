import { Request, Response, NextFunction } from "express";
import { AppError } from "./appError";
import { logger } from "../config/logger";

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? ((err as any).statusCode ?? 500) : 500;
  const message =
    err instanceof AppError ? (err as any).message : "Internal Server Error";

  logger.error("API Error:", message);

  res.status(statusCode).json({
    success: false,
    message,
  });
};
