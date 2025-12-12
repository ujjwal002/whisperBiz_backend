import { Request, Response } from "express";
import { MessengerService } from "./messenger.service";

export const MessengerController = {
  verify: (req: Request, res: Response) => {
    const VERIFY_TOKEN = process.env.MESSENGER_VERIFY_TOKEN;
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
      await MessengerService.handle(req.body);
      return res.sendStatus(200);
    } catch (err) {
      console.error("Messenger receive error:", err);
      return res.sendStatus(500);
    }
  }
};
