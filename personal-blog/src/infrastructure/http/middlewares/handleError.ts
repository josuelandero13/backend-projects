import express from "express";
import logger from "../../../shared/utils/logger";

export const handleError = (
  error: any,
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) => {
  logger.info(`Error: ${error.message}`);
  logger.info(`Error stack: ${error.stack}`);
  logger.info(`Request path: ${request?.path}`);
  logger.info(`Request method: ${request?.method}`);
  logger.info(`Request body: ${request?.body}`);

  const errorResponse = {
    error: {
      message: process.env.IS_PRODUCTION ? "An error occurred" : error.message,
      type: error.name,
      ...(process.env.IS_PRODUCTION ? {} : { stack: error.stack }),
      timestamp: new Date().toISOString(),
      path: request.path,
      method: request.method,
    },
  };

  switch (error.name) {
    case "CastError":
      return response.status(400).json({
        ...errorResponse,
        error: {
          ...errorResponse.error,
          message: "Malformatted ID. Please provide a valid ID.",
          details: { id: error.value },
        },
      });

    default:
      return response.status(500).json({
        ...errorResponse,
        error: {
          ...errorResponse.error,
          message: process.env.IS_PRODUCTION
            ? "An unexpected error occurred. Please try again later."
            : errorResponse.error.message,
        },
      });
  }
};
