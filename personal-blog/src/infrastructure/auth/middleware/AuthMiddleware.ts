import { Request, Response, NextFunction } from "express";
import { JwtService, JwtPayload } from "../JwtService.js";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export class AuthMiddleware {
  private jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService();
  }

  authenticate = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      const authHeader = req.headers?.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Access token required" });
        return;
      }

      const token = authHeader.substring(7);
      const decoded = this.jwtService.verifyAccessToken(token);

      req.user = decoded;

      next();
    } catch {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  };

  authorize = (roles: string[] = []) => {
    return (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction,
    ): void => {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        res.status(403).json({ error: "Insufficient permissions" });
        return;
      }

      next();
    };
  };

  optionalAuth = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    const authHeader = req.headers?.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.substring(7);
        const decoded = this.jwtService.verifyAccessToken(token);

        req.user = decoded;
      } catch {
        throw new Error("Invalid or expired token");
      }
    }

    next();
  };
}
