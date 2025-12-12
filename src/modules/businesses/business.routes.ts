// src/modules/businesses/business.routes.ts
import { Router } from "express";
import { BusinessController } from "./business.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { getBusinessParamsSchema, updateBusinessSchema } from "./business.schema";

const router = Router();

// Get the business owned by the authenticated user
router.get("/my", authMiddleware, BusinessController.getMyBusiness);

// Get business by id (owner-only or public read depending on your policy)
router.get("/:id", validate(getBusinessParamsSchema), authMiddleware, BusinessController.getById);

// Update business (owner only)
router.put("/:id", validate(updateBusinessSchema), authMiddleware, BusinessController.update);

export default router;
