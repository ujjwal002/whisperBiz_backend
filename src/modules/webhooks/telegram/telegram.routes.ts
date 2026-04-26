import { Router } from "express";
import { TelegramController } from "./telegram.controller";

const router = Router();

// Telegram rarely requires GET verification (Bot API uses setWebhook)
// Use POST to receive updates
router.post("/:businessId", TelegramController.receive);
export default router;
