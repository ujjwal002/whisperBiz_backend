// src/app.ts
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import bodyParser from "body-parser";

import router from "../src/routes"; // <-- your final routes/index.ts
import { errorHandler } from "./utils/errorHandler";
import { logger } from "./config/logger";
import { rateLimit } from "./middlewares/rateLimit.middleware";

export const createApp = () => {
  const app = express();

  /* ------------------ Global Middlewares ------------------ */
  app.use(helmet());
  app.use(cors());
  app.use(compression());

  app.use(bodyParser.json({ limit: "1mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));

  // Morgan logs -> Pino logger
  app.use(
    morgan("combined", {
      stream: {
        write: (msg) => logger.info(msg.trim()),
      },
    })
  );

  // Global rate limiter
  app.use(rateLimit);

  /* ------------------ Health Check ------------------ */
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
      ok: true,
      uptime: process.uptime(),
      timestamp: Date.now(),
    });
  });

  /* ------------------ Application Routes ------------------ */
  app.use("/", router);

  /* ------------------ 404 Handler ------------------ */
  app.use((req: Request, _res: Response, next: NextFunction) => {
    const err: any = new Error(`Not Found: ${req.originalUrl}`);
    err.statusCode = 404;
    next(err);
  });

  /* ------------------ Global Error Handler ------------------ */
  app.use(errorHandler);

  return app;
};
