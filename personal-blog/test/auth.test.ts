import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import supertest from "supertest";
import {
  connectDatabase,
  disconnectDatabase,
} from "../src/infrastructure/database/connection.js";
import { UserModel } from "../src/infrastructure/database/models/UserModel.js";
import argon2 from "argon2";
import app from "../src/infrastructure/http/server.js";

const api = supertest(app);

describe("Auth API", () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const response = await api.post("/api/auth/register").send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe(userData.username);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data).not.toHaveProperty("password");
      expect(response.body.data).not.toHaveProperty("passwordHash");
    });

    it("should return error for duplicate username", async () => {
      // Crear usuario primero
      await UserModel.create({
        username: "existinguser",
        email: "existing@example.com",
        passwordHash: await argon2.hash("password123"),
        role: "author",
      });

      const userData = {
        username: "existinguser",
        email: "new@example.com",
        password: "password123",
      };

      const response = await api.post("/api/auth/register").send(userData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await UserModel.create({
        username: "testuser",
        email: "test@example.com",
        passwordHash: await argon2.hash("password123"),
        role: "author",
      });
    });

    it("should login with valid credentials", async () => {
      const credentials = {
        username: "testuser",
        password: "password123",
      };

      const response = await api.post("/api/auth/login").send(credentials);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.user.username).toBe(credentials.username);
    });

    it("should return error for invalid credentials", async () => {
      const credentials = {
        username: "testuser",
        password: "wrongpassword",
      };

      const response = await api.post("/api/auth/login").send(credentials);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
