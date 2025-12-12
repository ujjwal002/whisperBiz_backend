import { Router } from "express";
import { UserBusinessController } from "./userBusiness.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  addUserToBusinessSchema,
  removeUserFromBusinessSchema,
  listBusinessMembersSchema,
} from "./userBusiness.schema";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Add a user to a business (owner only)
router.post(
  "/add",
  authMiddleware,
  validate(addUserToBusinessSchema),
  UserBusinessController.addMember
);

// Remove a user from business
router.post(
  "/remove",
  authMiddleware,
  validate(removeUserFromBusinessSchema),
  UserBusinessController.removeMember
);

// List members of a business
router.get(
  "/:businessId/members",
  authMiddleware,
  validate(listBusinessMembersSchema),
  UserBusinessController.listMembers
);

export default router;
