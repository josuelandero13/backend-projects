import { ArticleRepository } from "../../repositories/articleRepository.js";
import { Article } from "../../../../src/core/entities/Article";

export interface UpdateArticleRequest {
  title?: string;
  content?: string;
  published?: boolean;
}

export class UpdateArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(
    id: string,
    request: UpdateArticleRequest,
  ): Promise<Article | null> {
    if (request.title && request.title.length > 200) {
      throw new Error("Title must be less than 200 characters");
    }

    return this.articleRepository.update(id, request);
  }
}
