import { Request, Response } from "express";
import { WhatsappService } from "./whatsapp.service";

export const WhatsappController = {
  verify: (req: Request, res: Response) => {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
  },

  receive: async (req: Request, res: Response) => {
    try {
      // Body contains nested structure; WhatsappService will parse it
      await WhatsappService.handle(req.body);
      return res.status(200).send("EVENT_RECEIVED");
    } catch (err) {
      console.error("WhatsApp receive error:", err);
      return res.sendStatus(500);
    }
  }
};
