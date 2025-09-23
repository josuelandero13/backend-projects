import { loadEnvFile } from "node:process";

loadEnvFile();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "fallback-secret-change-in-production",
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET || "fallback-refresh-secret-change",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",

  // Rate limiting
  authRateLimitWindowMs: parseInt(
    process.env.AUTH_RATE_LIMIT_WINDOW_MS || "900000",
  ),
  authRateLimitMaxRequests: parseInt(
    process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || "5",
  ),
};
