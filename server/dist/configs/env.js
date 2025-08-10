"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().regex(/^\d+$/),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']),
    SECRET_KEY: zod_1.z.string().min(1),
    // mongo
    MONGODB_URI: zod_1.z.string().url(),
    // redis
    // REDIS_URI: z.string().url(),
    // REDIS_USERNAME: z.string().min(1),
    // REDIS_PASSWORD: z.string().min(1),
    // REDIS_HOST: z.string().min(1),
    // REDIS_PORT: z.string().regex(/^\d+$/),
    // jwt
    JWT_SECRET: zod_1.z.string().min(1),
    JWT_EXPIRES_IN: zod_1.z.string().min(1),
    JWT_REFRESH_SECRET: zod_1.z.string().min(1),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().min(1),
    // nodemailer
    EMAIL_PASS: zod_1.z.string().min(1),
    EMAIL_USER: zod_1.z.string().email(),
    // apis
    FRONTEND_URL: zod_1.z.string().url(),
    BACKEND_URL: zod_1.z.string().url(),
    // aws
    AWS_REGION: zod_1.z.string().min(1),
    AWS_BUCKET_NAME: zod_1.z.string().min(1),
    AWS_ACCESS_KEY_ID: zod_1.z.string().min(1),
    AWS_SECRET_ACCESS_KEY: zod_1.z.string().min(1),
});
const env = envSchema.parse(process.env);
exports.default = env;
//# sourceMappingURL=env.js.map