import { Request, Response } from "express";
import {
  AuthenticateUserUseCase,
  LoginRequest,
  RegisterUserUseCase,
  RegisterRequest,
  RefreshTokenUseCase,
} from "../../../application/use-cases/auth/index.js";
import { AuthenticatedRequest } from "../../auth/middleware/AuthMiddleware.js";
import logger from "../../../shared/utils/logger.js";

export class AuthController {
  constructor(
    private authenticateUserUseCase: AuthenticateUserUseCase,
    private registerUserUseCase: RegisterUserUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  async login(request: Request, response: Response): Promise<void> {
    try {
      const credentials: LoginRequest = request.body;
      const result = await this.authenticateUserUseCase.execute(credentials);

      response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error(error, "Login error:");

      if (error instanceof Error) {
        response.status(401).json({
          success: false,
          error: error.message,
        });
      } else {
        response.status(500).json({
          success: false,
          error: "Internal server error",
        });
      }
    }
  }

  async register(request: Request, response: Response): Promise<void> {
    try {
      const userData: RegisterRequest = request.body;
      const user = await this.registerUserUseCase.execute(userData);

      response.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error(error, "Registration error:");

      if (error instanceof Error) {
        response.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        response.status(500).json({
          success: false,
          error: "Internal server error",
        });
      }
    }
  }

  async refreshToken(request: Request, response: Response): Promise<void> {
    try {
      const { refreshToken } = request.body;

      if (!refreshToken) {
        response.status(400).json({
          success: false,
          error: "Refresh token required",
        });
        return;
      }

      const tokens = await this.refreshTokenUseCase.execute(refreshToken);

      response.status(200).json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      logger.error(error, "Refresh token error:");

      if (error instanceof Error) {
        response.status(401).json({
          success: false,
          error: error.message,
        });
      } else {
        response.status(500).json({
          success: false,
          error: "Internal server error",
        });
      }
    }
  }

  async getProfile(
    request: AuthenticatedRequest,
    response: Response,
  ): Promise<void> {
    try {
      if (!request.user) {
        response.status(401).json({
          success: false,
          error: "Not authenticated",
        });
        return;
      }

      response.status(200).json({
        success: true,
        data: {
          userId: request.user.userId,
          username: request.user.username,
          role: request.user.role,
        },
      });
    } catch (error) {
      logger.error(error, "Get profile error:");

      response.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}
