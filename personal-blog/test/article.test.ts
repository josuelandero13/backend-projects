import {
  connectDatabase,
  disconnectDatabase,
} from "../src/infrastructure/database/connection.js";
import { ArticleModel } from "../src/infrastructure/database/models/ArticleModel.js";
import app from "../src/infrastructure/http/server.js";
import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";
import supertest from "supertest";
import { Types } from "mongoose";

const api = supertest(app);

const testArticle = {
  id: "655555555555555555555555",
  title: "Test Article",
  content: "Test content",
  author: "testuser",
  published: true,
};

describe("Article API", () => {
  let createdArticleId: string;

  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  beforeEach(async () => {
    await ArticleModel.deleteMany({});

    const article = await ArticleModel.create(testArticle);

    createdArticleId = article._id;
  });

  describe("GET /api/articles", () => {
    it("should return empty array when no articles", async () => {
      await ArticleModel.deleteMany({});
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
      expect(response.body).toHaveLength(3); // 2 new + 1 from beforeEach
      expect(response.body[0].title).toBe("Published 2"); // Orden descendente
      expect(response.body[1].title).toBe("Published 1");
      expect(response.body[2].title).toBe(testArticle.title);
    });
  });

  describe("GET /api/articles/:id", () => {
    it("should return article by id", async () => {
      const response = await api.get(`/api/articles/${createdArticleId}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(testArticle.title);
      expect(response.body.content).toBe(testArticle.content);
      expect(response.body.author).toBe(testArticle.author);
      expect(response.body.published).toBe(testArticle.published);
    });

    it("should return 404 for non-existent article", async () => {
      const nonExistentId = new Types.ObjectId().toString();
      const response = await api.get(`/api/articles/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    it("should return 400 for invalid id format", async () => {
      const response = await api.get("/api/articles/650f45d99a1b8c7f8c3dADSAS6281c22");

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe("Malformatted ID. Please provide a valid ID.");
    });
  });

  describe("POST /api/articles", () => {
    it("should create a new article", async () => {
      const newArticle = {
        title: "New Test Article",
        content: "New Test content",
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
      expect(response.body.error).toBeDefined();
    });

    it("should create draft article when published is not provided", async () => {
      const draftArticle = {
        title: "Draft Article",
        content: "Draft content",
        author: "testuser",
      };

      const response = await api.post("/api/articles").send(draftArticle);

      expect(response.status).toBe(201);
      expect(response.body.published).toBe(false);
    });
  });

  describe("PUT /api/articles/:id", () => {
    it("should update an existing article", async () => {
      const updates = {
        title: "Updated Title",
        content: "Updated content",
        published: false,
      };

      const response = await api
        .put(`/api/articles/${createdArticleId}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updates.title);
      expect(response.body.content).toBe(updates.content);
      expect(response.body.published).toBe(updates.published);

      // Verify the update was saved to the database
      const updatedArticle = await ArticleModel.findById(createdArticleId);
      expect(updatedArticle?.title).toBe(updates.title);
    });

    it("should return 404 for non-existent article", async () => {
      const nonExistentId = new Types.ObjectId().toString();
      const response = await api.put(`/api/articles/${nonExistentId}`).send({
        title: "Updated",
      });

      expect(response.status).toBe(404);
    });

    it("should return 400 for invalid update data", async () => {
      const response = await api.put(`/api/articles/${createdArticleId}`).send({
        title: "", // Invalid: empty title
        content: "Valid content",
      });

      expect(response.status).toBe(400);
    });

    it("should not update read-only fields", async () => {
      const originalArticle = await ArticleModel.findById(createdArticleId);
      const originalCreatedAt = originalArticle?.createdAt;

      await new Promise((resolve) => setTimeout(resolve, 100)); // Ensure timestamp changes

      const response = await api.put(`/api/articles/${createdArticleId}`).send({
        title: "New Title",
        createdAt: new Date(), // Try to change read-only field
        updatedAt: new Date(), // Try to change read-only field
      });

      expect(response.status).toBe(200);

      const updatedArticle = await ArticleModel.findById(createdArticleId);
      expect(updatedArticle?.createdAt).toEqual(originalCreatedAt);
      expect(updatedArticle?.updatedAt.getTime()).toBeGreaterThan(
        originalCreatedAt.getTime(),
      );
    });
  });

  describe("DELETE /api/articles/:id", () => {
    it("should delete an existing article", async () => {
      const response = await api.delete(`/api/articles/${createdArticleId}`);

      expect(response.status).toBe(204);

      // Verify the article was deleted
      const deletedArticle = await ArticleModel.findById(createdArticleId);
      expect(deletedArticle).toBeNull();
    });

    it("should return 404 for non-existent article", async () => {
      const nonExistentId = new Types.ObjectId().toString();
      const response = await api.delete(`/api/articles/${nonExistentId}`);

      expect(response.status).toBe(404);
    });

    it("should return 400 for invalid id format", async () => {
      const response = await api.delete("/api/articles/invalid-id");

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe("Malformatted ID. Please provide a valid ID.");
    });
  });
});
