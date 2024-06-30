import prisma from "../db";

export const GetArticle = async (req, res) => {
	try {
		const article = await prisma.article.findMany();

		return res.json({ article: article });
	} catch (e) {
		console.log(e.message());
	}
};
