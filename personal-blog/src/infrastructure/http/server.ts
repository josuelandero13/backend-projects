import express from "express";
import cors from "cors";
import logger from "../../shared/utils/logger";
import { config } from "../../../config/config";
import { connectDatabase } from "../database/connection";
import articleRoutes from "./routes/articleRoutes.js";
import { handleError } from "./middlewares/handleError";

const app: express.Application = express();
const PORT = config.port || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/articles", articleRoutes);

// Error handler
app.use(handleError);

// Not found route
app.use((_request, response) => {
  response.status(404).json({ error: "Route not found" });
});

// Connect to the database and then start the server
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(error, "Failed to start server:");
    process.exit(1);
  });

export default app;
