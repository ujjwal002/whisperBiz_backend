import { Router } from "express";
import { ChatPreferenceController } from "./chatPreference.controller";
import { validate } from "../../middlewares/validate.middleware";
import { updatePreferenceSchema, getPreferenceSchema } from "./chatPreference.schema";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Update preference
router.post(
  "/",
  authMiddleware,
  validate(updatePreferenceSchema),
  ChatPreferenceController.update
);

// Get preference
router.get(
  "/:userId/:businessId",
  authMiddleware,
  validate(getPreferenceSchema),
  ChatPreferenceController.get
);

export default router;
