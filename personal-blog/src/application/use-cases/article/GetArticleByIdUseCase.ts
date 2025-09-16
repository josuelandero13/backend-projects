import { ArticleRepository } from "../../repositories/articleRepository.js";
import { Article } from "../../../../src/core/entities/Article";

export class GetArticleByIdUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(id: string): Promise<Article | null> {
    return this.articleRepository.findById(id);
  }
}
