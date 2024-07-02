import { Prisma } from "@prisma/client";
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
	try {
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
	} catch (error) {
		if (error instanceof Prisma.PrismaClientValidationError) {
			return res.status(400).json({ message: "invalid fields" });
		}

		if (error.code === "P2002") {
			return res.status(400).json({
				message: `An article with the title "${req.body.title}" already exists.`,
			});
		}

		return res.status(500).json({ message: "Internal server error" });
	}
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
export const DeleteArticle = async (req: Request, res: Response, next) => {
	try {
		const del = await prisma.article.delete({
			where: {
				id: req.params.id,
				belongsToId: req.user.id,
			},
		});

		res.status(200).json({ message: "article deleted successfully" });
	} catch (error) {
		next(error);
	}
};
