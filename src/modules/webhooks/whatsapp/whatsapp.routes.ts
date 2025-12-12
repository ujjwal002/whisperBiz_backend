import { Router } from "express";
import { WhatsappController } from "./whatsapp.controller";

const router = Router();

router.get("/", WhatsappController.verify);
router.post("/", WhatsappController.receive);

export default router;
