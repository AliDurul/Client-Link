import { z } from 'zod';

export const registerUserSchema = z.object({
    // name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
    email: z.string().email('Invalid email address').max(100, 'Email must be less than 100 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters long').max(16, 'Password must be less than 16 characters'),
}).strict();

export type TRegisterUser = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
    email: z.string().email('Invalid email address').max(100, 'Email must be less than 100 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters long').max(16, 'Password must be less than 16 characters'),
}).strict();

export type TLoginUser = z.infer<typeof loginUserSchema>;

export const verifyEmailSchema = z.object({
    verificationToken: z.string().length(6, 'Verification token must be 6 digits long')
}).strict();

export type TVerifyEmail = z.infer<typeof verifyEmailSchema>;

export const forgetPassSchema = z.object({
    email: z.string().email('Invalid email address').max(100, 'Email must be less than 100 characters'),
}).strict();

export type TForgetPass = z.infer<typeof forgetPassSchema>;

export const resetPassSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters long').max(16, 'Password must be less than 16 characters')
}).strict();

export type TResetPass = z.infer<typeof resetPassSchema>;