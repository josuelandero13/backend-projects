import {
  connectDatabase,
  disconnectDatabase,
} from "../src/infrastructure/database/connection.js";
import { ArticleModel } from "../src/infrastructure/database/models/ArticleModel.js";
import app from "../src/infrastructure/http/server.js";
import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";
import supertest from "supertest";

const api = supertest(app);

describe("Article API", () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  beforeEach(async () => {
    await ArticleModel.deleteMany({});
  });

  describe("GET /api/articles", () => {
    it("should return empty array when no articles", async () => {
      const response = await api.get("/api/articles");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return published articles only", async () => {
      await ArticleModel.create([
        {
          title: "Published 1",
          content: "Content 1",
          author: "test",
          published: true,
        },
        {
          title: "Published 2",
          content: "Content 2",
          author: "test",
          published: true,
        },
        {
          title: "Draft",
          content: "Content 3",
          author: "test",
          published: false,
        },
      ]);

      const response = await api.get("/api/articles");
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe("Published 2"); // Orden descendente
      expect(response.body[1].title).toBe("Published 1");
    });
  });

  describe("POST /api/articles", () => {
    it("should create a new article", async () => {
      const newArticle = {
        title: "Test Article",
        content: "Test content",
        author: "testuser",
        published: true,
      };

      const response = await api.post("/api/articles").send(newArticle);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newArticle.title);
      expect(response.body.content).toBe(newArticle.content);
      expect(response.body.author).toBe(newArticle.author);
      expect(response.body.published).toBe(newArticle.published);
      expect(response.body.id).toBeDefined();
    });

    it("should return error for invalid data", async () => {
      const invalidArticle = {
        title: "",
        content: "Test content",
        author: "testuser",
      };

      const response = await api.post("/api/articles").send(invalidArticle);

      expect(response.status).toBe(400);
    });
  });
});
