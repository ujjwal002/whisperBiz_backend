import { Router } from "express";
import { MessengerWebhookController } from "./messengerWebhook.controller";

const router = Router();

// GET for verification
router.get("/", MessengerWebhookController.verify);

// POST for messages
router.post("/", MessengerWebhookController.handler);

export default router;
