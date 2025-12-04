// src/routes/index.ts
import { Router } from "express";

// API ROUTES
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/user.routes";
import businessRoutes from "../modules/businesses/business.routes";
import userBusinessRoutes from "../modules/user-businesses/userBusiness.routes";
import integrationRoutes from "../modules/messaging-integrations/integration.routes";
import chatMessageRoutes from "../modules/chat-messages/chatMessage.routes";
import chatPreferenceRoutes from "../modules/chat-preferences/chatPreference.routes";

// WEBHOOK ROUTES
import telegramWebhookRoutes from "../modules/webhooks/telegram/telegramWebhook.routes";
import whatsappWebhookRoutes from "../modules/webhooks/whatsapp/whatsappWebhook.routes";
import messengerWebhookRoutes from "../modules/webhooks/messenger/messengerWebhook.routes";

const router = Router();

/* ---------------------- API ROUTES ---------------------- */
router.use("/api/auth", authRoutes);
router.use("/api/users", userRoutes);
router.use("/api/businesses", businessRoutes);
router.use("/api/user-businesses", userBusinessRoutes);
router.use("/api/messaging-integrations", integrationRoutes);
router.use("/api/chat-messages", chatMessageRoutes);
router.use("/api/chat-preferences", chatPreferenceRoutes);

/* ---------------------- WEBHOOK ROUTES ---------------------- */
/**
 * These are intentionally NOT under /api
 * because platforms like WhatsApp, Telegram, Messenger
 * must call exact webhook URLs without auth middlewares.
 */
router.use("/webhooks/telegram", telegramWebhookRoutes);
router.use("/webhooks/whatsapp", whatsappWebhookRoutes);
router.use("/webhooks/messenger", messengerWebhookRoutes);

export default router;
