import { Router } from "express";
import { ChatMessageController } from "./chatMessage.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  sendMessageSchema,
  getUserMessagesSchema,
  getBusinessMessagesSchema,
} from "./chatMessage.schema";

const router = Router();

// Admin replies
router.post(
  "/admin/send",
  authMiddleware,
  validate(sendMessageSchema),
  ChatMessageController.sendAdminReply
);

// All messages for a specific user
router.get(
  "/:businessId/user/:userId",
  authMiddleware,
  validate(getUserMessagesSchema),
  ChatMessageController.getUserMessages
);

// All messages for business
router.get(
  "/:businessId",
  authMiddleware,
  validate(getBusinessMessagesSchema),
  ChatMessageController.getBusinessMessages
);

export default router;
