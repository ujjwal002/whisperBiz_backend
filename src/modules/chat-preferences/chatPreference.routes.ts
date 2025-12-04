import { Router } from "express";
import { ChatPreferenceController } from "./chatPreference.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { updateChatPreferenceSchema, getChatPreferenceSchema } from "./chatPreference.schema";

const router = Router();

// GET preference for business
router.get(
  "/:businessId",
  authMiddleware,
  validate(getChatPreferenceSchema),
  ChatPreferenceController.get
);

// UPDATE AI reply ON/OFF
router.post(
  "/update",
  authMiddleware,
  validate(updateChatPreferenceSchema),
  ChatPreferenceController.update
);

export default router;
