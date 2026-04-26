import { Router } from "express";
import { ChatMessageController } from "./chatMessage.controller";
import { validate } from "../../middlewares/validate.middleware";
import { sendMessageSchema, getMessagesSchema } from "./chatMessage.schema";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, validate(sendMessageSchema), ChatMessageController.send);

router.get(
  "/:userId/:businessId",
  authMiddleware,
  // validate(getMessagesSchema),
  ChatMessageController.getConversation
);

router.get(
  "/business/:businessId/users",
  authMiddleware,
  ChatMessageController.listUsers
);

export default router;
