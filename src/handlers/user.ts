import type { User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../lib/jwt.server";
import { sendEmailVerification } from "../modules/email";

export const createUser = async (req: Request, res: Response) => {
	let user: User;
	try {
		// create user with credentials provided
		user = await prisma.user.create({
			data: {
				email: req.body.email,
				username: req.body.username,
				verified: true, // TODO: Remove this once email verification is set
			},
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const [field] = error.meta?.target as string[];
			return res.status(403).json({ message: `${field} already exists` });
		}
	}

	// store password in db
	await prisma.authCredential.create({
		data: {
			userId: user.id,
			password: await hashPassword(req.body.password),
		},
	});

	// send verification:
	// TODO: Set up email verification once hosted
	await sendEmailVerification(req.body.email);

	res.status(200).json({ message: "account created successfully" });
};

export const Login = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	// interact with database to check if user has an account
	const user = await prisma.user.findFirst({
		where: {
			OR: [{ email: req.body.email }, { username: req.body.username }],
			verified: true,
		},
	});

	// if account is not found
	if (!user) {
		return res.status(400).json({
			message: "Invalid email or password",
		});
	}

	// get user credentials
	const authCredential = await prisma.authCredential.findFirst({
		where: { userId: user.id },
	});

	// if no credentials, throw error
	if (!authCredential) {
		return res.status(400).json({
			message: "Invalid email or password",
		});
	}

	// compare passwords
	const passwordMatch = await comparePasswords(
		req.body.password,
		authCredential.password,
	);

	// if passwords do not match
	if (!passwordMatch) {
		return res.status(400).json({
			message: "Invalid email/username or password",
		});
	}

	// if account is not verified
	if (!user.verified) {
		return res.status(400).json({
			message: "Invalid email/username or password",
		});
	}

	// create token for user
	const token = createJWT(user);

	// set cookie for user
	res.cookie("auth", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 1000 * 3600 * 24 * 30, // 30 days
		sameSite: "lax",
	});

	return res.status(200).json({
		message: "login successful",
	});
};
