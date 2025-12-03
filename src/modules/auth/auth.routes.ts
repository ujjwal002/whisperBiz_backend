// src/modules/auth/auth.routes.ts
import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { signupSchema, loginSchema, refreshTokenSchema } from "./auth.schema";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/signup", validate(signupSchema), AuthController.signup);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/refresh", validate(refreshTokenSchema), AuthController.refreshToken);

// protected
router.post("/change-password", authMiddleware, AuthController.changePassword);

export default router;
