import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { AuthMiddleware } from "../../auth/middleware/AuthMiddleware.js";
import {
  AuthenticateUserUseCase,
  RegisterUserUseCase,
  RefreshTokenUseCase,
} from "../../../application/use-cases/auth/index.js";
import { MongoUserRepository } from "../../database/repositories/MongoUserRepository.js";
import { JwtService } from "../../auth/JwtService.js";
import { authLimiter } from "../middleware/rateLimiting.js";

const userRepository = new MongoUserRepository();
const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware();

const authenticateUserUseCase = new AuthenticateUserUseCase(
  userRepository,
  jwtService,
);
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const refreshTokenUseCase = new RefreshTokenUseCase(jwtService, userRepository);

const authController = new AuthController(
  authenticateUserUseCase,
  registerUserUseCase,
  refreshTokenUseCase,
);

const router: Router = Router();

// Rutas públicas
router.post("/login", authLimiter, (request: Request, response: Response) =>
  authController.login(request, response),
);
router.post("/register", authLimiter, (request: Request, response: Response) =>
  authController.register(request, response),
);
router.post("/refresh", authLimiter, (request: Request, response: Response) =>
  authController.refreshToken(request, response),
);

// Rutas protegidas
router.get(
  "/profile",
  authMiddleware.authenticate,
  (request: Request, response: Response) =>
    authController.getProfile(request as any, response),
);

export default router;
