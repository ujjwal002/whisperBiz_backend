import { Router } from "express";
import {
  meHandler,
  createUserHandler,
  listUsersHandler,
  getUserHandler,
  updateUserHandler,
  linkProfileHandler,
} from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createUserSchema, updateUserSchema, queryUsersSchema } from "./user.schema";

const router = Router();

// protected profile endpoints
router.get("/me", authMiddleware, meHandler);

// admin-like endpoints (keep protected)
router.post("/", authMiddleware, validate(createUserSchema), createUserHandler);
router.get("/", authMiddleware, validate(queryUsersSchema), listUsersHandler);
router.get("/:id", authMiddleware, getUserHandler);
router.put("/:id", authMiddleware, validate(updateUserSchema), updateUserHandler);
router.post("/:id/link-profile", authMiddleware, linkProfileHandler);

export default router;
