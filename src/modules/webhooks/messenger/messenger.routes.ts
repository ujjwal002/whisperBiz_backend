import { Router } from "express";
import { MessengerController } from "./messenger.controller";

const router = Router();

router.get("/", MessengerController.verify);
router.post("/", MessengerController.receive);

export default router;
