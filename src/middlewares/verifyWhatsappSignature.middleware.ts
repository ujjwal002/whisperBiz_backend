import { Request, Response, NextFunction } from "express";

export const verifyWhatsappSignature = (req: Request, res: Response, next: NextFunction) => {
  // WhatsApp also supports signature verification.
  next();
};
