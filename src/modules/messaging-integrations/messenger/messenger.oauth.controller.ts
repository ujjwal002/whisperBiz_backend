// modules/messaging-integrations/messenger/messenger.oauth.controller.ts
import { Request, Response } from "express";
import { MessengerOAuthService } from "./messenger.oauth.service";

export const MessengerOAuthController = {
  getOAuthUrl(req: Request, res: Response) {
    try {
      console.log("Generating Messenger OAuth URL for businessId:", req.query.businessId);
      const businessId = String(req.query.businessId || "");
      if (!businessId) return res.status(400).json({ error: "businessId is required" });

      const url = MessengerOAuthService.generateAuthUrl(businessId);
      return res.json({ oauthUrl: url });
    } catch (err: any) {
      console.error("Messenger OAuth URL error:", err);
      return res.status(500).json({ error: err.message || "internal" });
    }
  },

  async callback(req: Request, res: Response) {
    try {
      const code = String(req.query.code || "");
      const state = String(req.query.state || ""); // we use state=businessId
      if (!code) return res.status(400).json({ error: "code is required" });
      if (!state) return res.status(400).json({ error: "state (businessId) is required" });

      const result = await MessengerOAuthService.handleCallback(code, state);

      // By default return the saved credentials + pages list so frontend can show what was connected
      return res.json({ success: true, saved: true, result });
    } catch (err: any) {
      console.error("Messenger OAuth callback error:", err);
      // Facebook often calls callback in browser — returning json is okay; you can also redirect to a success page.
      return res.status(500).json({ error: err.message || "OAuth callback failed" });
    }
  },
};
