// src/modules/auth/auth.routes.ts
import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  registerBusinessSchema,
  loginBusinessSchema,
  registerUserSchema,
  loginUserSchema,
} from "./auth.schema";

const router = Router();

// BUSINESS OWNER
router.post("/register-business",validate(registerBusinessSchema), AuthController.registerBusiness);
router.post("/login-business", validate(loginBusinessSchema), AuthController.loginBusiness);

// USERS
router.post("/register-user", validate(registerUserSchema), AuthController.registerUser);
router.post("/login-user", validate(loginUserSchema), AuthController.loginUser);

export default router;
