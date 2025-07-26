import { forgetPassSchema, loginUserSchema, registerUserSchema, resetPassSchema, verifyEmailSchema } from '../utils/validationSchemas';
import { forgetPassword, login, logout, refresh, register, resetPassword, verifyEmail } from '../controllers/auth.controller';
import { isValidated } from '../middlewares/common';
import { Router } from 'express';

const router = Router();

// Base route: /api/v1/auth

router.post('/register',  register);
router.post('/login', isValidated(loginUserSchema), login);
router.post('/refresh', refresh);
router.all('/logout', logout);

router.post('/verify-email', isValidated(verifyEmailSchema), verifyEmail);
router.post('/forget-password', isValidated(forgetPassSchema), forgetPassword);
router.post('/reset-password/:resetPassToken', isValidated(resetPassSchema), resetPassword);


export default router;