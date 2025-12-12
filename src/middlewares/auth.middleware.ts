import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../libs/jwt";
import { AuthPayload } from "../types";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing token" });
    }

    const token = auth.split(" ")[1];
    const decoded = verifyAccessToken(token) as AuthPayload;

    req.user = decoded; // <-- NOW MATCHES GLOBAL TYPE

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
