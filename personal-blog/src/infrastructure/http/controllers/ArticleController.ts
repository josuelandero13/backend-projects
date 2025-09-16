import { Request, Response } from "express";
import {
  GetArticlesUseCase,
  GetArticleByIdUseCase,
  CreateArticleUseCase,
  CreateArticleRequest,
  UpdateArticleUseCase,
  UpdateArticleRequest,
  DeleteArticleUseCase,
} from "../../../application/use-cases/article/index.js";
import logger from "../../../shared/utils/logger.js";

export class ArticleController {
  constructor(
    private getArticlesUseCase: GetArticlesUseCase,
    private getArticleByIdUseCase: GetArticleByIdUseCase,
    private createArticleUseCase: CreateArticleUseCase,
    private updateArticleUseCase: UpdateArticleUseCase,
    private deleteArticleUseCase: DeleteArticleUseCase,
  ) {}

  async getArticles(request: Request, response: Response): Promise<void> {
    try {
      const publishedOnly = request.query.published !== "false";
      const articles = await this.getArticlesUseCase.execute(publishedOnly);

      response.status(200).json(articles);
    } catch (error) {
      logger.error(error, "Error getting articles:");

      response.status(500).json({ error: "Internal server error" });
    }
  }

  async getArticleById(request: Request, response: Response): Promise<void> {
    try {
      const { id } = request.params;
      const article = await this.getArticleByIdUseCase.execute(id);

      if (!article) {
        response.status(404).json({ error: "Article not found" });
        return;
      }

      response.status(200).json(article);
    } catch (error) {
      logger.error(error, "Error getting article:");

      response.status(500).json({ error: "Internal server error" });
    }
  }

  async createArticle(request: Request, response: Response): Promise<void> {
    try {
      const requestBody: CreateArticleRequest = request.body;
      const article = await this.createArticleUseCase.execute(requestBody);

      response.status(201).json(article);
    } catch (error) {
      logger.error(error, "Error creating article:");

      if (error instanceof Error) {
        response.status(400).json({ error: error.message });
      } else {
        response.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async updateArticle(request: Request, response: Response): Promise<void> {
    try {
      const { id } = request.params;
      const requestBody: UpdateArticleRequest = request.body;

      const article = await this.updateArticleUseCase.execute(id, requestBody);

      if (!article) {
        response.status(404).json({ error: "Article not found" });
        return;
      }

      response.status(200).json(article);
    } catch (error) {
      logger.error(error, "Error updating article:");

      if (error instanceof Error) {
        response.status(400).json({ error: error.message });
      } else {
        response.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async deleteArticle(request: Request, response: Response): Promise<void> {
    try {
      const { id } = request.params;
      const success = await this.deleteArticleUseCase.execute(id);

      if (!success) {
        response.status(404).json({ error: "Article not found" });
        return;
      }

      response.status(204).send();
    } catch (error) {
      logger.error(error, "Error deleting article:");

      response.status(500).json({ error: "Internal server error" });
    }
  }
}
