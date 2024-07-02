import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ROUNDS = +process.env.SALT_ROUNDS || 7;

export const createJWT = (user: { id: string; username: string }): string => {
	return jwt.sign(
		{ id: user.id, username: user.username },
		process.env.JWT_SECRET as string,
	);
};

export const comparePasswords = (
	password: string,
	hash: string,
): Promise<boolean> => {
	return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string): Promise<string> => {
	return bcrypt.hash(password, ROUNDS);
};
