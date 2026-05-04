import { Router } from "express";
import { MessengerController } from "./messenger.controller";
// import verifyMessengerSignatureMiddleware from "./messenger.signature";
import { verifyMessengerSignatureMiddleware } from "../../../middlewares/verifyMessengerSignature.middleware";

const router = Router();

router.get("/", MessengerController.verify);
router.post("/", verifyMessengerSignatureMiddleware, MessengerController.receive);

export default router;
