import { Router } from "express";
import { MessagingIntegrationController } from "./integration.controller";
import { validate } from "../../middlewares/validate.middleware";
import { connectIntegrationSchema, disconnectIntegrationSchema } from "./integration.schema";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Connect platform
router.post(
  "/connect",
  authMiddleware,
  validate(connectIntegrationSchema),
  MessagingIntegrationController.connect
);

// Disconnect platform
router.post(
  "/disconnect",
  authMiddleware,
  validate(disconnectIntegrationSchema),
  MessagingIntegrationController.disconnect
);

// List integrations for a business
router.get(
  "/:businessId",
  authMiddleware,
  MessagingIntegrationController.list
);

export default router;
