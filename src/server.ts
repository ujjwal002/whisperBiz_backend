// src/server.ts
import { createApp } from "./app";
import { connectDB } from "../src/libs/db";
import { Env } from "../src/config/env";
import { logger } from "./config/logger";

const start = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Create Express App
    const app = createApp();

    // Start Server
    const server = app.listen(Env.PORT, () => {
      logger.info(`🚀 Server running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
    });

    /* ------------------ Graceful Shutdown ------------------ */
    const shutdown = (signal: string) => {
      logger.warn(`${signal} received. Closing server...`);
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });

      setTimeout(() => {
        logger.error("Force shutdown due to timeout");
        process.exit(1);
      }, 10000).unref();
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    logger.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

start();
