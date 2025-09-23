import argon2 from "argon2";
import { UserRepository } from "../../repositories/userRepository.js";
import { User } from "../../../../src/core/entities/User.js";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: RegisterRequest): Promise<Omit<User, "passwordHash">> {
    const { username, email, password, role = "author" } = request;

    if (!username || !email || !password) {
      throw new Error("Username, email and password are required");
    }

    if (username.length < 3) {
      throw new Error("Username must be at least 3 characters long");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email format");
    }

    const existingUser = await this.userRepository.findByUsername(username);

    if (existingUser) {
      throw new Error("Username already taken");
    }

    const existingEmail = await this.userRepository.findByEmail(email);

    if (existingEmail) {
      throw new Error("Email already registered");
    }

    const optionsHashingPassword = {
      type: argon2.argon2id,
      hashLength: 32,
      timeCost: 4,
      memoryCost: 2 ** 16,
      parallelism: 1,
    };

    const passwordHash = await argon2.hash(password, optionsHashingPassword);

    const user = await this.userRepository.create({
      username,
      email,
      passwordHash,
      role: role as "admin" | "author" | "guest",
    });

    const { passwordHash: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
