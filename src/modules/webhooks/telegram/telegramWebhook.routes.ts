import { Router } from "express";
import { TelegramWebhookController } from "./telegramWebhook.controller";

const router = Router();

router.post("/", TelegramWebhookController.handler);

export default router;
