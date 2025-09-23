import jwt from "jsonwebtoken";
import { config } from "../../../config/config.js";

export interface JwtPayload {
  userId: string;
  username: string;
  role: string;
}

export class JwtService {
  private readonly secret: string;
  private readonly refreshSecret: string;
  private readonly expiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor() {
    this.secret = config.jwtSecret;
    this.refreshSecret = config.jwtRefreshSecret;
    this.expiresIn = config.jwtExpiresIn;
    this.refreshExpiresIn = config.jwtRefreshExpiresIn;
  }

  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(
      { ...payload } as object,
      this.secret as jwt.Secret,
      {
        expiresIn: this.expiresIn,
        issuer: "personal-blog-api",
        audience: "personal-blog-users",
      } as jwt.SignOptions,
    );
  }

  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(
      { ...payload } as object,
      this.refreshSecret as jwt.Secret,
      {
        expiresIn: this.refreshExpiresIn,
        issuer: "personal-blog-api",
        audience: "personal-blog-users",
      } as jwt.SignOptions,
    );
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch {
      throw new Error("Invalid or expired access token");
    }
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.refreshSecret) as JwtPayload;
    } catch {
      throw new Error("Invalid or expired refresh token");
    }
  }

  decodeToken(token: string): JwtPayload {
    return jwt.decode(token) as JwtPayload;
  }
}
