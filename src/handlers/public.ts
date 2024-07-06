import prisma from "../db";
import type { Request, Response, NextFunction } from "express";

// This returns all articles to viewers whether logged in or not
export const allArticles = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const articles = await prisma.article.findMany({
			where: { published: true },
			orderBy: {
				createdAt: "desc",
			},
		});

		res.json({ data: articles });
	} catch (error) {
		next(error);
	}
};
