import { Router } from "express";
import { IntegrationController } from "./integration.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { connectPlatformSchema, disconnectPlatformSchema } from "./integration.schema";

const router = Router();

// Connect a platform (owner only)
router.post("/connect", authMiddleware, validate(connectPlatformSchema), IntegrationController.connect);

// Disconnect
router.post("/disconnect", authMiddleware, validate(disconnectPlatformSchema), IntegrationController.disconnect);

// List integrations for business
router.get("/:businessId", authMiddleware, IntegrationController.getByBusiness);

export default router;
