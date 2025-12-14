import { Router } from "express";
import { MessagingIntegrationController } from "./integration.controller";
import { validate } from "../../middlewares/validate.middleware";
import { connectIntegrationSchema, disconnectIntegrationSchema } from "./integration.schema";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { fetchHistory } from "./history";
import messengerOauthRoutes from "./messenger/messenger.oauth.routes";



const router = Router();

// Connect platform
router.post(
  "/connect",
  authMiddleware,
  validate(connectIntegrationSchema),
  MessagingIntegrationController.connect
);

// Disconnect platform
router.post(
  "/disconnect",
  authMiddleware,
  validate(disconnectIntegrationSchema),
  MessagingIntegrationController.disconnect
);

// List integrations for a business
router.get(
  "/:businessId",
  authMiddleware,
  MessagingIntegrationController.list
);

router.post('/fetch-history', authMiddleware, async (req, res) => {
  try {
    const { businessId, platform } = req.body;
    if (!businessId || !platform) return res.status(400).json({ error: 'businessId and platform required' });

    const result = await fetchHistory(platform, businessId);
    return res.json(result);
  } catch (err: any) {
    console.error('fetch-history error', err);
    return res.status(500).json({ error: err.message || 'unknown' });
  }
});

router.use("/messenger", messengerOauthRoutes);



export default router;
