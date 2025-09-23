import { User, UserCredentials } from "../../core/entities/User.js";

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  validateCredentials(credentials: UserCredentials): Promise<boolean>;
}
