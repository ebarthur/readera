import { Prisma } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../db";

// @POST /draft
// Draft an article
export const CreateDraft = async (req: Request, res: Response) => {
	const draft = await prisma.article.create({
		data: {
			title: req.body.title,
			description: req.body.description,
			body: req.body.body,
			published: false,
			belongsToId: req.user.id,
		},
	});

	res.json({ data: draft });
};

// @GET /draft
// Get drafts
export const GetDrafts = async (req: Request, res: Response) => {
	const drafts = await prisma.article.findMany({
		where: {
			published: false,
			belongsToId: req.user.id,
		},
	});

	res.json({ data: drafts });
};

// @GET /draft/:id
// Get one draft
export const GetOneDraft = async (req: Request, res: Response) => {
	const { id } = req.params;

	const draft = await prisma.article.findFirst({
		where: {
			id,
			belongsToId: req.user.id,
			published: false,
		},
	});

	res.json({ data: draft });
};

// @PATCH /draft/:id
// Move draft to published
export const PublishDraft = async (req: Request, res: Response) => {
	await prisma.article.update({
		where: {
			id: req.params.id,
			belongsToId: req.user.id,
		},
		data: {
			published: true,
		},
	});
	res.json({ message: "draft published successfully" });
};

// @DELETE /draft/:id
// Delete draft from db
export const DeleteDraft = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		await prisma.article.delete({
			where: {
				id,
				belongsToId: req.user.id,
				published: false,
			},
		});
		res.status(200).json({ message: "Draft deleted successfully" });
	} catch (error) {
		console.log(error);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return res.status(400).json({ message: "an error occurred" });
		}
	}
};
