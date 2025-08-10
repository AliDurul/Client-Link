import 'dotenv/config';

import { z } from 'zod'


const envSchema = z.object({
    PORT: z.string().regex(/^\d+$/),
    NODE_ENV: z.enum(['development', 'production', 'test']),
    SECRET_KEY: z.string().min(1),
    // mongo
    MONGODB_URI: z.string().url(),
    // redis
    // REDIS_URI: z.string().url(),
    // REDIS_USERNAME: z.string().min(1),
    // REDIS_PASSWORD: z.string().min(1),
    // REDIS_HOST: z.string().min(1),
    // REDIS_PORT: z.string().regex(/^\d+$/),
    // jwt
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    JWT_REFRESH_EXPIRES_IN: z.string().min(1),
    // nodemailer
    EMAIL_PASS: z.string().min(1),
    EMAIL_USER: z.string().email(),
    // apis
    FRONTEND_URL: z.string().url(), 
    BACKEND_URL: z.string().url(), 
    // aws
    AWS_REGION: z.string().min(1),
    AWS_BUCKET_NAME: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
});

const env = envSchema.parse(process.env);

export default env;