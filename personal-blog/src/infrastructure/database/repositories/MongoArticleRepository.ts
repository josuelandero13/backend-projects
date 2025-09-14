import { ArticleRepository } from "../../../application/repositories/articleRepository.js";
import { Article } from "../../../core/entities/Article.js";
import { ArticleModel, ArticleDocument } from "../models/ArticleModel.js";

export class MongoArticleRepository implements ArticleRepository {
  private toArticle(document: ArticleDocument): Article {
    return {
      id: document._id?.toString() || "",
      title: document.title,
      content: document.content,
      author: document.author,
      published: document.published,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  async findAll(publishedOnly: boolean = true): Promise<Article[]> {
    const query = publishedOnly ? { published: true } : {};
    const articles = await ArticleModel.find(query).sort({ createdAt: -1 });

    return articles.map(this.toArticle);
  }

  async findById(id: string): Promise<Article | null> {
    const article = await ArticleModel.findById(id);

    return article ? this.toArticle(article) : null;
  }

  async create(
    articleData: Omit<Article, "id" | "createdAt" | "updatedAt">,
  ): Promise<Article> {
    const article = new ArticleModel(articleData);
    const savedArticle = await article.save();

    return this.toArticle(savedArticle);
  }

  async update(
    id: string,
    articleData: Partial<Article>,
  ): Promise<Article | null> {
    const { id: _, ...updateData } = articleData;
    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    );

    return updatedArticle ? this.toArticle(updatedArticle) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ArticleModel.findByIdAndDelete(id);

    return result !== null;
  }

  async findByAuthor(
    authorId: string,
    publishedOnly: boolean = false,
  ): Promise<Article[]> {
    const query: Record<string, any> = { author: authorId };

    if (publishedOnly) {
      query.published = true;
    }

    const articles = await ArticleModel.find(query).sort({ createdAt: -1 });

    return articles.map(this.toArticle);
  }
}
