import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export default function handleInputErrors(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(400);
		res.json({ errors: errors.array() });
		return;
	}
	next();
}
