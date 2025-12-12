import { Request, Response, NextFunction } from "express";
import { ChatMessageService } from "./chatMessage.service";

export const ChatMessageController = {
  send: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const msg = await ChatMessageService.sendMessage(req.body);
      res.status(201).json({ message: msg });
    } catch (err) {
      next(err);
    }
  },

  getConversation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, businessId } = req.params;
      const messages = await ChatMessageService.getConversation(userId, businessId);
      res.json({ messages });
    } catch (err) {
      next(err);
    }
  },

  listUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.params.businessId;
      const userIds = await ChatMessageService.getAllUsersWhoChatted(businessId);
      res.json({ userIds });
    } catch (err) {
      next(err);
    }
  }
};
