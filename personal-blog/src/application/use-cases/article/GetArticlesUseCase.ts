import { ArticleRepository } from "../../repositories/articleRepository.js";
import { Article } from "../../../../src/core/entities/Article";

export class GetArticlesUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(publishedOnly: boolean = true): Promise<Article[]> {
    return this.articleRepository.findAll(publishedOnly);
  }
}
