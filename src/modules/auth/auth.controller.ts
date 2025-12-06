// src/modules/auth/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

export const AuthController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, full_name } = req.body;
      const result = await AuthService.signup(email, password, full_name);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      console.log("Login attempt for email:", email);
      const result = await AuthService.login(email, password);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refresh_token } = req.body;
      const result = await AuthService.refresh(refresh_token);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });
      const { newPassword } = req.body;
      await AuthService.changePassword(userId, newPassword);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },
};
