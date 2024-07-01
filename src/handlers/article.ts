import type { Request, Response } from "express";
import prisma from "../db";

// @GET /api/v1/article
// Get all articles by user
export const GetArticles = async (req: Request, res: Response) => {
	const user = await prisma.user.findUnique({
		where: { id: req.user.id },
		include: { articles: true },
	});

	res.json({ data: user.articles });
};

// @POST /api/v1/article
// Create an article
export const CreateArticle = async (req: Request, res: Response) => {
	const article = await prisma.article.create({
		data: {
			title: req.body.title,
			description: req.body.description,
			body: req.body.body,
			published: true,
			belongsToId: req.user.id,
		},
	});

	res.json({ data: article });
};

// @GET /article/:id
// Get an article by id
export const GetOneArticle = async (req: Request, res: Response) => {
	const article = await prisma.article.findUnique({
		where: {
			id: req.params.id,
			belongsToId: req.user.id,
		},
	});

	res.json({ data: article });
};

// @PATCH /article/:id
// Edit an article
export const EditArticle = async (req: Request, res: Response) => {
	await prisma.article.update({
		where: {
			id_belongsToId: {
				id: req.params.id,
				belongsToId: req.user.id,
			},
		},
		data: {
			title: req.body.title,
			description: req.body.description,
			body: req.body.body,
		},
	});

	res.json({ message: "changes saved" });
};

// @DELETE /article:id
// Delete an article from the db
export const DeleteArticle = async (req: Request, res: Response) => {
	await prisma.article.delete({
		where: {
			id: req.params.id,
			belongsToId: req.user.id,
		},
	});

	res.json({ message: "article deleted successfully" });
};
