import express from "express";
import cors from "cors";
import logger from "../../shared/utils/logger";
import { config } from "../../../config/config";
import { connectDatabase } from "../database/connection";
import mongoose from "mongoose";

const app = express();
const PORT = config.port || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Connect to the database and then start the server
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Failed to start server:", error);
    process.exit(1);
  });
