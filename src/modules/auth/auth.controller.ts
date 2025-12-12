// src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export const AuthController = {
  registerBusiness: async (req: Request, res: Response) => {
    try {
      const { businessName, email, password } = req.body;
      console.log("Registering business with:", { businessName, email,password });
      const result = await AuthService.registerBusiness(businessName, email, password);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  loginBusiness: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      console.log("Logging in business with:", { email, password });
      const result = await AuthService.loginBusiness(email, password);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  registerUser: async (req: Request, res: Response) => {
    try {
      const { fullName, email, password, businessCode } = req.body;
      const result = await AuthService.registerUser(fullName, email, password, businessCode);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  loginUser: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.loginUser(email, password);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
