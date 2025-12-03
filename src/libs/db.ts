import mongoose from "mongoose";
import { Env } from "../config/env";
import { logger } from "../config/logger";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(Env.MONGO_URL, {
      autoIndex: true,
    });

    logger.success(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.error("❌ MongoDB connection failed:", error.message);
    setTimeout(connectDB, 5000); // Retry every 5 seconds
  }
};
