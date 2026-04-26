import { Request, Response } from "express";
import { TelegramService } from "./telegram.service";

export const TelegramController = {
  receive: async (req: Request, res: Response) => {
  try {
    console.log("req:", req.params.businessId);
    await TelegramService.handle(req.body, req.params.businessId);
    return res.sendStatus(200);
  } catch (err) {
    console.error("Telegram receive error:", err);
    return res.sendStatus(500);
  }
}
};
