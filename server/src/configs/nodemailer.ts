import nodemailer, { Transporter } from 'nodemailer';
import env from './env';

let transporter: Transporter | null = null;

export function getTransporter(): Transporter {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: env.EMAIL_USER,
                pass: env.EMAIL_PASS,
            },
        });
    }

    return transporter;
}