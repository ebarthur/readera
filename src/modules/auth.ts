import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const protect = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	// get cookie from header
	const { cookie } = req.headers;

	if (!cookie) {
		return res.status(401).json({ message: "unauthorized" });
	}

	const [_, token] = cookie.split("=");

	if (!token) {
		return res.status(401).json({
			message: "unauthorized",
		});
	}

	//verify token
	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch (error) {
		return res.status(401).json({ message: "not valid token" });
	}
};
