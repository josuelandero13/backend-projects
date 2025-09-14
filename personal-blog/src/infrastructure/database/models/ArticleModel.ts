import mongoose, { Schema, Document } from "mongoose";
import { Article } from "../../../core/entities/Article";

export interface ArticleDocument extends Omit<Article, "id">, Document {}

const ArticleSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para actualizar la fecha de modificación
ArticleSchema.pre("save", function (next) {
  this.updatedAt = new Date();

  next();
});

export const ArticleModel = mongoose.model<ArticleDocument>(
  "Article",
  ArticleSchema,
);
