"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassSchema = exports.forgetPassSchema = exports.verifyEmailSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    // name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
    email: zod_1.z.string().email('Invalid email address').max(100, 'Email must be less than 100 characters'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long').max(16, 'Password must be less than 16 characters'),
}).strict();
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address').max(100, 'Email must be less than 100 characters'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long').max(16, 'Password must be less than 16 characters'),
}).strict();
exports.verifyEmailSchema = zod_1.z.object({
    verificationToken: zod_1.z.string().length(6, 'Verification token must be 6 digits long')
}).strict();
exports.forgetPassSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address').max(100, 'Email must be less than 100 characters'),
}).strict();
exports.resetPassSchema = zod_1.z.object({
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long').max(16, 'Password must be less than 16 characters')
}).strict();
//# sourceMappingURL=validationSchemas.js.map