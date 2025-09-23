import { JwtService } from "../../../infrastructure/auth/JwtService.js";
import { UserRepository } from "../../repositories/userRepository.js";

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async execute(refreshToken: string): Promise<RefreshTokenResponse> {
    if (!refreshToken) {
      throw new Error("Refresh token required");
    }

    const decoded = this.jwtService.verifyRefreshToken(refreshToken);

    // Verificar que el usuario todavía existe
    const user = await this.userRepository.findByUsername(decoded.username);
    if (!user) {
      throw new Error("User not found");
    }

    // Generar nuevos tokens
    const payload = {
      userId: user.id!,
      username: user.username,
      role: user.role,
    };

    const newAccessToken = this.jwtService.generateAccessToken(payload);
    const newRefreshToken = this.jwtService.generateRefreshToken(payload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
