import { Router } from "express";
import { body } from "express-validator";
import {
	CreateArticle,
	DeleteArticle,
	EditArticle,
	GetArticles,
	GetOneArticle,
} from "./handlers/article";
import {
	CreateDraft,
	DeleteDraft,
	GetDrafts,
	GetOneDraft,
	PublishDraft,
} from "./handlers/draft";
import handleInputErrors from "./modules/middleware";

const router = Router();

/*
 * Articles
 */
router.get("/article", GetArticles);
router.get("/article/:id", GetOneArticle);
router.patch(
	"/article/:id",
	handleInputErrors,
	body("title").optional(),
	body("description").optional(),
	body("body").optional(),
	EditArticle,
);
router.post(
	"/article",
	handleInputErrors,
	body("title").isString(),
	body("description").optional(),
	body("body").isString(),
	CreateArticle,
);
router.delete("/article/:id", DeleteArticle);

/*
 * Drafts
 */
router.get("/draft", GetDrafts);
router.get("/draft/:id", GetOneDraft);
router.post(
	"/draft",
	handleInputErrors,
	body("title").isString(),
	body("description").optional(),
	body("body").isString(),
	CreateDraft,
);
router.patch("/draft/:id", PublishDraft);
router.delete("/draft/:id", DeleteDraft);

export default router;
