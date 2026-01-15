import nodemailer from 'nodemailer';
import { VERIFICATION_EMAIL_TEMPLATE } from './mailTemplate.js';

const sendVerificationMail = async (email, subject, verificationLink) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: Number(process.env.EMAIL_PORT),
			secure: Boolean(process.env.SECURE),
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});

		const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationLink}", verificationLink);

		await transporter.sendMail({
			from: process.env.USER,
			to: email,
			subject: subject,
			html: htmlContent,
		});
		console.log("Email sent successfully");
	} catch (error) {
		console.log(error);
		return error;
	}
};

export default sendVerificationMail;