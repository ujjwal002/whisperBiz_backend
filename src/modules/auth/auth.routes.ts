import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { signupSchema, loginSchema, refreshTokenSchema } from "./auth.schema";

const router = Router();

router.post("/signup", validate(signupSchema), AuthController.signup);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/refresh", validate(refreshTokenSchema), AuthController.refreshToken);

export default router;
