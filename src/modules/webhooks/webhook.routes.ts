import { Router } from "express";
import whatsappRoutes from "./whatsapp/whatsapp.routes";
import telegramRoutes from "./telegram/telegram.routes";
import messengerRoutes from "./messenger/messenger.routes";

const router = Router();

router.use("/whatsapp", whatsappRoutes);
router.use("/telegram", telegramRoutes);
router.use("/messenger", messengerRoutes);

export default router;
