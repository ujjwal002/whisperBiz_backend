import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";

export const UserController = {
  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      console.log("UserController.me - User ID:", req.user.id);
      const userId = req.user.id;
      const user = await UserService.getMe(userId);
      res.json({ user });
    } catch (err) {
      next(err);
    }
  },

  getUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserService.getUser(req.params.id);
      res.json({ user });
    } catch (err) {
      next(err);
    }
  },

  listUsers: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserService.listUsers();
      res.json({ users });
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await UserService.updateUser(req.params.id, req.body);
      res.json({ updated });
    } catch (err) {
      next(err);
    }
  }
};
