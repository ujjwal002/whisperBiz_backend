import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { updateUserSchema } from "./user.schema";

const router = Router();

router.get("/me", authMiddleware, UserController.me);

router.get("/", authMiddleware, UserController.listUsers);

router.get("/:id", authMiddleware, UserController.getUser);

router.put("/:id", authMiddleware, validate(updateUserSchema), UserController.updateUser);

export default router;
