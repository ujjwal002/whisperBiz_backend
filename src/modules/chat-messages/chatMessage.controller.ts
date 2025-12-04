import { Request, Response, NextFunction } from "express";
import { ChatMessageService } from "./chatMessage.service";

export const ChatMessageController = {
  sendAdminReply: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const requestingUserId = req.user.id;
      const { businessId, userId, message } = req.body;

      const result = await ChatMessageService.sendAdminMessage(
        requestingUserId,
        businessId,
        userId,
        message
      );

      res.status(201).json({ message: result });
    } catch (err) {
      next(err);
    }
  },

  getUserMessages: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { businessId, userId } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;

      const messages = await ChatMessageService.getMessagesForUser(userId, businessId, page, limit);

      res.json({ messages });
    } catch (err) {
      next(err);
    }
  },

  getBusinessMessages: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const requestingUserId = req.user.id;
      const { businessId } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;

      const messages = await ChatMessageService.getMessagesForBusiness(
        requestingUserId,
        businessId,
        page,
        limit
      );

      res.json({ messages });
    } catch (err) {
      next(err);
    }
  },
};
