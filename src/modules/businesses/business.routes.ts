import { Router } from "express";
import { BusinessController } from "./business.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  createBusinessSchema,
  updateBusinessSchema,
  getBusinessSchema,
} from "./business.schema";

const router = Router();

// Create business (owner)
router.post("/",authMiddleware, validate(createBusinessSchema), BusinessController.create);

// Update business
router.put("/:businessId", authMiddleware, validate(updateBusinessSchema), BusinessController.update);

// Get business details
router.get("/:businessId", authMiddleware, validate(getBusinessSchema), BusinessController.get);

// List all businesses owned by user
router.get("/", authMiddleware, BusinessController.listOwned);

export default router;
