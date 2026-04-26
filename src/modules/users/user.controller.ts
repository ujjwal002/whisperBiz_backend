import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { AuthUser } from "../auth/auth.model";


export const UserController = {
  me: async (req: any, res: Response, next: NextFunction) => {
    try {
      const authUserId = req.user.id;

      const user = await AuthUser.findById(authUserId).select("-password");
      if (!user) return res.status(404).json({ error: "User not found" });

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
