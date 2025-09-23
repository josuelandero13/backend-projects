import { Request, Response } from "express";
import { config } from "../../../../config/config.js";

const LIMIT = config.authRateLimitMaxRequests;
const WINDOW = config.authRateLimitWindowMs;

const requests: Record<string, { count: number; firstRequestTime: number }> =
  {};

export const authLimiter = (
  request: Request,
  response: Response,
  next: Function,
) => {
  const ip = request?.ip as string;
  const now = Date.now();

  if (!requests[ip]) {
    requests[ip] = { count: 1, firstRequestTime: now };

    return next();
  }

  const clientData = requests[ip];
  const timePassed = now - clientData.firstRequestTime;

  if (timePassed < WINDOW) {
    if (clientData.count < LIMIT) {
      clientData.count++;
      return next();
    } else {
      return response
        .status(429)
        .json({ message: "Too many requests, try later." });
    }
  } else {
    requests[ip] = { count: 1, firstRequestTime: now };

    return next();
  }
};
