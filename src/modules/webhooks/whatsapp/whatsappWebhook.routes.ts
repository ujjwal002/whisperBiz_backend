import { Router } from "express";
import { WhatsAppWebhookController } from "./whatsappWebhook.controller";

const router = Router();

router.get("/", (req, res) => {
  // verification for WhatsApp webhook hub.challenge
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  return res.status(200).send(challenge);
});

router.post("/", WhatsAppWebhookController.handler);

export default router;
