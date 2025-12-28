import { Request, Response } from "express";
import { MessengerOAuthService } from "./messenger.oauth.service";

export const MessengerOAuthController = {
  // 1️⃣ Generate OAuth URL (used by frontend)
  getOAuthUrl(req: Request, res: Response) {
    try {
      const businessId = String(req.query.businessId || "");
      if (!businessId) {
        return res.status(400).json({ error: "businessId is required" });
      }

      const url = MessengerOAuthService.generateAuthUrl(businessId);
      return res.json({ oauthUrl: url });
    } catch (err: any) {
      console.error("Messenger OAuth URL error:", err);
      return res.status(500).json({ error: err.message || "internal" });
    }
  },

  // 2️⃣ Facebook OAuth callback (THIS WAS WRONG BEFORE)
  async callback(req: Request, res: Response) {
    try {
      const code = String(req.query.code || "");
      const state = String(req.query.state || ""); // businessId

      if (!code || !state) {
        return res.status(400).send("Missing code or state");
      }

      // 🔥 OAuth + Save integration (already working)
      await MessengerOAuthService.handleCallback(code, state);

      // 🔥 REQUIRED: Redirect user back to frontend
      const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

      return res.redirect(
        `${process.env.FRONTEND_URL}/business/dashboard?messenger=connected`
      );
    } catch (err: any) {
      console.error("Messenger OAuth callback error:", err);

      const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

      return res.redirect(
        `${FRONTEND_URL}/integrations?messenger=error`
      );
    }
  },
};
