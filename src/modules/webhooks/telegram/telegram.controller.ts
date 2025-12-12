import { Request, Response } from "express";
import { TelegramService } from "./telegram.service";

export const TelegramController = {
  receive: async (req: Request, res: Response) => {
    try {
      await TelegramService.handle(req.body);
      return res.sendStatus(200);
    } catch (err) {
      console.error("Telegram receive error:", err);
      return res.sendStatus(500);
    }
  }
};
