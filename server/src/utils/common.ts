import { pbkdf2Sync } from 'node:crypto';
import jwt from 'jsonwebtoken';
import compression from 'compression';
import { Request, Response } from 'express';
import { getTransporter } from '../configs/nodemailer';
import { ENV } from '../configs/env';
import { IUser } from '../models/user.model';
import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";



// ===============================
// 1. CUSTOM ERROR CLASS
// ===============================
export class CustomError extends Error {
    override name = "CustomError";
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = false) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
};


// ===============================
// 2. PASSWORD ENCRYPTION
// ===============================
export function passwordEncrypt(pass: string): string {

    const keyCode = ENV.secretKey;
    const loopCount = 10000;
    const charCount = 32;
    const encType = 'sha512';

    return pbkdf2Sync(pass, keyCode, loopCount, charCount, encType).toString('hex');
}


// ===============================
// 3. multer
// ===============================

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });


// ===============================
// 4. S3 CLIENT
// ===============================
export const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});


export const getImageUrl = async (key: string): Promise<string> => {
    const getObjectParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return url;
};

// ===============================
// 5. SET TOKEN
// ===============================
interface TokenResult {
    success: boolean;
    access: string;
    refresh: string | null;
}
export function setToken(user: IUser, isRefresh: boolean = false): TokenResult {

    // const { password, verificationToken, resetPassToken, ...accessData } = user
    const accessData = {
        id: user._id,
        email: user.email,
        phone: user.phone_number || null,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        profile_pic: user.profile_pic || null,
        user_type: user.role || '',
        isVerified: user.is_verified || false,
    }

    return {
        success: true,
        access: jwt.sign(accessData, ENV.jwtSecret, { expiresIn: ENV.jwtExpiresIn as jwt.SignOptions['expiresIn'] }),
        refresh: isRefresh ? null : jwt.sign({ id: user._id }, ENV.jwtRefreshSecret, { expiresIn: ENV.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'] })
    }
};


// ===============================
// 6. SEND EMAIL
// ===============================
interface MailFrom {
    name: string;
    address: string;
}

interface SendMailOptions {
    to: string;
    subject: string;
    tempFn: (data?: any) => string;
    data?: any;
    from?: MailFrom;
    text?: string | null;
}

export const sendMail = async ({
    to,
    subject,
    tempFn,
    data = null,
    from = null,
    text = null
}: SendMailOptions): Promise<void> => {
    const transporter = getTransporter();

    const mailOptions = {
        from: from || { name: 'Your App', address: ENV.emailUser },
        to,
        subject,
        html: data ? tempFn(data) : tempFn(),
        text: text || undefined,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error: any) {
        console.error('Error sending email:', error);
        throw new CustomError(`Error sending email. Error ${error.message}`, 500, true);
    }
};


// ===============================
// 7. SHOULD COMPRESS
// ===============================
export function shouldCompress(req: Request, res: Response): boolean {
    if (req.headers['x-no-compression'] || req.query.nozip) {
        return false;
    }
    return compression.filter(req, res);
}

// ===============================
// 8. VALIDATE FUTURE DATE
// ===============================

export const validateFutureDate = (dateString: string, fieldName: string = 'Date'): void => {
    if (!dateString) return;

    const inputDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(inputDate.getTime())) {
        throw new CustomError(`${fieldName} is not a valid date`, 400);
    }

    if (inputDate < today) {
        throw new CustomError(`${fieldName} cannot be in the past`, 400);
    }
};