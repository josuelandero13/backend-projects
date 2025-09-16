import { ArticleRepository } from "../../repositories/articleRepository.js";

export class DeleteArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.articleRepository.delete(id);
  }
}
