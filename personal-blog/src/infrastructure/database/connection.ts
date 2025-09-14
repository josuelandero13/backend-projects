import mongoose from "mongoose";
import { config } from "../../../config/config.js";
import logger from "../../shared/utils/logger";

export const connectDatabase = async (): Promise<void> => {
  if (!config.mongoUri) {
    logger.error("MongoDB connection URI is not defined");
    process.exit(1);
  }

  const connectionOptions = {
    // Increase timeout for slower connections
    serverSelectionTimeoutMS: 5000,
    // Connection pool size optimization
    maxPoolSize: 10,
    // Heartbeat to keep connections alive
    heartbeatFrequencyMS: 10000,
  };

  try {
    await mongoose.connect(config.mongoUri, connectionOptions);

    logger.info("Connected to MongoDB successfully");
  } catch (error: any) {
    logger.error(error, "MongoDB connection error");
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    logger.info("Disconnected from MongoDB");
  } catch (error: any) {
    logger.error(error, "Error disconnecting from MongoDB");
  }
};
