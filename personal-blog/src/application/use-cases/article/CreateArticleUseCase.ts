import { ArticleRepository } from "../../repositories/articleRepository.js";
import { Article } from "../../../../src/core/entities/Article";

export interface CreateArticleRequest {
  title: string;
  content: string;
  author: string;
  published?: boolean;
}

export class CreateArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(request: CreateArticleRequest): Promise<Article> {
    if (!request.title || !request.content || !request.author) {
      throw new Error("Title, content and author are required");
    }

    if (request.title.length > 200) {
      throw new Error("Title must be less than 200 characters");
    }

    return this.articleRepository.create({
      title: request.title,
      content: request.content,
      author: request.author,
      published: request.published || false,
    });
  }
}
