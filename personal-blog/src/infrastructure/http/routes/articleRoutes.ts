import { Router } from "express";
import { ArticleController } from "../controllers/ArticleController";
import {
  GetArticlesUseCase,
  GetArticleByIdUseCase,
  CreateArticleUseCase,
  UpdateArticleUseCase,
  DeleteArticleUseCase,
} from "../../../application/use-cases/article/index.js";
import { MongoArticleRepository } from "../../database/repositories/MongoArticleRepository.js";

const articleRepository = new MongoArticleRepository();
const getArticlesUseCase = new GetArticlesUseCase(articleRepository);
const getArticleByIdUseCase = new GetArticleByIdUseCase(articleRepository);
const createArticleUseCase = new CreateArticleUseCase(articleRepository);
const updateArticleUseCase = new UpdateArticleUseCase(articleRepository);
const deleteArticleUseCase = new DeleteArticleUseCase(articleRepository);

const articleController = new ArticleController(
  getArticlesUseCase,
  getArticleByIdUseCase,
  createArticleUseCase,
  updateArticleUseCase,
  deleteArticleUseCase,
);

const router: Router = Router();

router.get("/", (request, response) =>
  articleController.getArticles(request, response),
);

router.get("/:id", (request, response, next) =>
  articleController.getArticleById(request, response, next),
);

router.post("/", (request, response) =>
  articleController.createArticle(request, response),
);

router.put("/:id", (request, response) =>
  articleController.updateArticle(request, response),
);

router.delete("/:id", (request, response, next) =>
  articleController.deleteArticle(request, response, next),
);

export default router;
