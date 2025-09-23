import { UserRepository } from "../../repositories/userRepository.js";
import { JwtService } from "../../../infrastructure/auth/JwtService.js";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const { username, password } = request;

    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    const isValid = await this.userRepository.validateCredentials({
      username,
      password,
    });

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new Error("User not found");
    }

    const payload = {
      userId: user.id!,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshToken = this.jwtService.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id!,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
}
