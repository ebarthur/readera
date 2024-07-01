import type { EmailVerificationRequest } from "@prisma/client";
import prisma from "../db";
import { send } from "../lib/mail.server";
import { randomStr } from "../lib/random-str";

async function sendEmailVerification(email: string) {
	const existingVerification = await prisma.emailVerificationRequest.findFirst({
		where: { email },
	});

	if (!existingVerification) {
		const verification = await prisma.emailVerificationRequest.create({
			data: {
				token: randomStr(48),
				email,
			},
		});
		return await sendEmail(verification);
	}
}

async function sendEmail(verification: EmailVerificationRequest) {
	const domain = process.env.DOMAIN;
	const { email, token } = verification;

	const link = [
		`${domain}/verify-email`,
		`/?email=${email}`,
		`&token=${token}`,
	].join("");

	return await send({
		to: verification.email,
		from: "a@readera",
		subject: "Account verification @readera",
		text: `Hi and welcome to readera,\n\nClick 
		the following link to verify 
		your account: ${link}.\n\nSee you!\n\n\n(You cannot reply to this email.)`,
	});
}

export { sendEmailVerification };
