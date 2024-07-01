import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const protect = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	// get cookie from header
	const [_, token] = req.headers.cookie.split("=");

	if (!token) {
		return res.status(400).json({
			message: "unauthorized",
		});
	}

	//verify token
	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch (error) {
		res.status(401);
		res.json({ message: "not valid token" });
		return;
	}
};
