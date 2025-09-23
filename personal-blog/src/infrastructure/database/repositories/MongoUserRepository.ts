import argon2 from "argon2";
import { UserRepository } from "../../../application/repositories/userRepository.js";
import { User, UserCredentials } from "../../../core/entities/User.js";
import { UserModel, UserDocument } from "../models/UserModel.js";

export class MongoUserRepository implements UserRepository {
  private toUser(document: UserDocument): User {
    return {
      id: document._id?.toString() || "",
      username: document.username,
      email: document.email,
      passwordHash: document.passwordHash,
      role: document.role,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await UserModel.findOne({ username });

    return user ? this.toUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });

    return user ? this.toUser(user) : null;
  }

  async create(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<User> {
    const user = new UserModel(userData);
    const savedUser = await user.save();

    return this.toUser(savedUser);
  }

  async validateCredentials(credentials: UserCredentials): Promise<boolean> {
    const user = await UserModel.findOne({ username: credentials.username });

    if (!user) return false;

    return argon2.verify(user.passwordHash, credentials.password);
  }
}
