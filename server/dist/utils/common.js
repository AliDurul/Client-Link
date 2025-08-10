"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFutureDate = exports.sendMail = exports.getImageUrl = exports.s3 = exports.upload = exports.CustomError = void 0;
exports.passwordEncrypt = passwordEncrypt;
exports.setToken = setToken;
exports.shouldCompress = shouldCompress;
const node_crypto_1 = require("node:crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const compression_1 = __importDefault(require("compression"));
const nodemailer_1 = require("../configs/nodemailer");
const env_1 = __importDefault(require("../configs/env"));
const multer_1 = __importDefault(require("multer"));
const client_s3_1 = require("@aws-sdk/client-s3");
const client_s3_2 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
// ===============================
// 1. CUSTOM ERROR CLASS
// ===============================
class CustomError extends Error {
    name = "CustomError";
    statusCode;
    isOperational;
    constructor(message, statusCode = 500, isOperational = false) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
;
// ===============================
// 2. PASSWORD ENCRYPTION
// ===============================
function passwordEncrypt(pass) {
    const keyCode = env_1.default.SECRET_KEY;
    const loopCount = 10000;
    const charCount = 32;
    const encType = 'sha512';
    return (0, node_crypto_1.pbkdf2Sync)(pass, keyCode, loopCount, charCount, encType).toString('hex');
}
// ===============================
// 3. multer
// ===============================
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage: storage });
// ===============================
// 4. S3 CLIENT
// ===============================
exports.s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});
const getImageUrl = async (key) => {
    const getObjectParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    };
    const command = new client_s3_2.GetObjectCommand(getObjectParams);
    const url = await (0, s3_request_presigner_1.getSignedUrl)(exports.s3, command, { expiresIn: 3600 });
    return url;
};
exports.getImageUrl = getImageUrl;
function setToken(user, isRefresh = false) {
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
    };
    return {
        success: true,
        access: jsonwebtoken_1.default.sign(accessData, env_1.default.JWT_SECRET, { expiresIn: env_1.default.JWT_EXPIRES_IN }),
        refresh: isRefresh ? null : jsonwebtoken_1.default.sign({ id: user._id }, env_1.default.JWT_REFRESH_SECRET, { expiresIn: env_1.default.JWT_REFRESH_EXPIRES_IN })
    };
}
;
const sendMail = async ({ to, subject, tempFn, data = null, from = null, text = null }) => {
    const transporter = (0, nodemailer_1.getTransporter)();
    const mailOptions = {
        from: from || { name: 'Your App', address: env_1.default.EMAIL_USER },
        to,
        subject,
        html: data ? tempFn(data) : tempFn(),
        text: text || undefined,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new CustomError(`Error sending email. Error ${error.message}`, 500, true);
    }
};
exports.sendMail = sendMail;
// ===============================
// 7. SHOULD COMPRESS
// ===============================
function shouldCompress(req, res) {
    if (req.headers['x-no-compression'] || req.query.nozip) {
        return false;
    }
    return compression_1.default.filter(req, res);
}
// ===============================
// 8. VALIDATE FUTURE DATE
// ===============================
const validateFutureDate = (dateString, fieldName = 'Date') => {
    if (!dateString)
        return;
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
exports.validateFutureDate = validateFutureDate;
//# sourceMappingURL=common.js.map