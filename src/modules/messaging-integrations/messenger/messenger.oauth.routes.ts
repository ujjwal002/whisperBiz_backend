// modules/messaging-integrations/messenger/messenger.oauth.routes.ts
import { Router } from "express";
import { MessengerOAuthController } from "./messenger.oauth.controller";
import { MessengerPageSelectionController } from "./messenger.pageSelection.controller";


const router = Router();

/**
 * GET /integrations/messenger/oauth-url?businessId=...
 * Returns a Facebook OAuth login URL (frontend redirects user to it).
 */
router.get("/oauth-url", MessengerOAuthController.getOAuthUrl);

/**
 * GET /integrations/messenger/callback?code=...&state=<businessId>
 * Facebook will redirect here after user grants permissions.
 */
router.get("/callback", MessengerOAuthController.callback);
router.post("/select-page", MessengerPageSelectionController.selectPage);


export default router;
