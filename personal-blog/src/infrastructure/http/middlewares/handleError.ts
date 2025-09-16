import express from "express";
import logger from "../../../shared/utils/logger";

export const handleError = (
  error: any,
  _request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) => {
  logger.error(error, "Unhandled error:");

  response.status(500).json({ error: "Internal server error" });

  next();
};
