import { Router } from "express";
import { UserBusinessController } from "./userBusiness.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  addUserToBusinessSchema,
  removeUserFromBusinessSchema,
  listBusinessMembersSchema,
} from "./userBusiness.schema";

const router = Router();

// Owner actions
router.post("/add", authMiddleware, validate(addUserToBusinessSchema), UserBusinessController.addMember);
router.post("/remove", authMiddleware, validate(removeUserFromBusinessSchema), UserBusinessController.removeMember);

// Listing members (owner or member)
router.get("/:businessId/members", authMiddleware, validate(listBusinessMembersSchema), UserBusinessController.listMembers);

export default router;
