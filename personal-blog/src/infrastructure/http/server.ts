import express from "express";
import cors from "cors";
import logger from "../../shared/utils/logger";
import { config } from "../../../config/config";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = config.port || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port http://localhost:${PORT}`);
});
