import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";

/**
 * GET /api/users/me
 * Requires authMiddleware
 */
export async function meHandler(req: Request, res: Response, next: NextFunction) {
  try {
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = await UserService.getUserById(userId);
    return res.json({ user });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/users
 * Create system user (admin action)
 */
export async function createUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, role, profile_id } = req.body;
    const user = await UserService.createUser({ email, role, profile_id });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users
 * Query users (pagination + optional email filter)
 */
export async function listUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, email } = req.query as any;
    const result = await UserService.getUsers({ page: Number(page) || 1, limit: Number(limit) || 20, email });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users/:id
 */
export async function getUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const user = await UserService.getUserById(id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/users/:id
 */
export async function updateUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const payload = req.body;
    const updated = await UserService.updateUser(id, payload);
    res.json({ user: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/users/:id/link-profile
 */
export async function linkProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const { profile_id } = req.body;
    const updated = await UserService.linkProfile(id, profile_id);
    res.json({ user: updated });
  } catch (err) {
    next(err);
  }
}
