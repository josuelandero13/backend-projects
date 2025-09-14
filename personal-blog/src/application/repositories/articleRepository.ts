import { Article } from "../../core/entities/Article";

export interface ArticleRepository {
  findAll(publishedOnly?: boolean): Promise<Article[]>;
  findById(id: string): Promise<Article | null>;
  create(
    article: Omit<Article, "id" | "createdAt" | "updatedAt">,
  ): Promise<Article>;
  update(id: string, article: Partial<Article>): Promise<Article | null>;
  delete(id: string): Promise<boolean>;
  findByAuthor(authorId: string, publishedOnly?: boolean): Promise<Article[]>;
}
