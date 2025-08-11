import { Request, Response, NextFunction } from 'express';
import env from '../configs/env';
import User, { IUser } from '../models/user.model';
import { CustomError, getImageUrl, passwordEncrypt, sendMail, setToken } from '../utils/common';
import { passResetReqTemp, passResetSuccessTemp, verificationEmailTemp, welcomeEmailTemp } from '../utils/emailTemplates';
import crypto from 'node:crypto';
import { TForgetPass, TLoginUser, TRegisterUser, TResetPass, TVerifyEmail } from '../utils/validationSchemas';
import jwt from 'jsonwebtoken';


export const register = async (req: Request, res: Response): Promise<void> => {

    const { email } = req.body as TRegisterUser;

    const exists = await User.exists({ email });

    if (exists) throw new CustomError('User already exists', 409, true);

    const user = await User.create(req.body);

    // await sendMail({
    //     to: user.email,
    //     subject: 'Verify your email',
    //     tempFn: verificationEmailTemp,
    //     data: { verificationCode: user.verification_token }
    // });

    res.status(201).send({
        success: true,
        message: 'Please check your email to verify your account'
    });
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as TLoginUser;

    const user = await User.findOne({ email, password });

    if (!user) throw new CustomError('Invalid email or password', 401, true);

    // if (!user.isVerified) throw new CustomError('Email not verified', 403, true);

    user.last_login = new Date();
    await user.save();

    if (user.profile_pic) {
        user.profile_pic = await getImageUrl(user.profile_pic);
    }

    res.status(200).send(setToken(user));
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
    console.log('refresh calisit');
    const refreshToken: string | undefined = req.body?.refresh

    if (!refreshToken) throw new CustomError('Please enter token.refresh', 401, true);

    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { id: string };

    if (!decoded?.id) throw new CustomError('Invalid token: missing id.', 403, true);

    const user: IUser | null = await User.findOne({ _id: decoded.id }).lean();

    if (!user) throw new CustomError('User not found.', 404, true);

    res.status(200).send(setToken(user, true));
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    res.status(200).send({ success: true, message: 'Logged out successfully' });
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {

    const { verificationToken } = req.body as TVerifyEmail;

    const user = await User.findOne({ verificationToken, verificationTokenExpiresAt: { $gt: new Date() } });

    if (!user) throw new CustomError('Invalid or expired verification token', 400);

    user.is_verified = true;
    user.verification_token = undefined;
    user.verification_token_expires_at = undefined;
    await user.save();

    sendMail({
        to: user.email,
        subject: 'Email verified successfully',
        tempFn: welcomeEmailTemp
    });

    res.status(200).send({
        success: true,
        message: 'Email verified successfully'
    });
};

export const forgetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body as TForgetPass;

    const user = await User.findOne({ email });

    if (!user) throw new CustomError('User not found', 404, true);

    if (!user.is_verified) throw new CustomError('User email is not verified. Please verify your email.', 403, true);

    user.reset_pass_token = crypto.randomBytes(20).toString('hex');

    user.reset_pass_expires_at = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours later

    await user.save();

    await sendMail({
        to: user.email,
        subject: 'Reset your password',
        tempFn: passResetReqTemp,
        data: { resetURL: env.FRONTEND_URL + '/reset-password/' + user.reset_pass_token }
    });

    res.status(200).send({
        success: true,
        message: 'Password reset link sent to your email'
    });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { resetPassToken } = req.params;
    const { password } = req.body as TResetPass;

    const user = await User.findOne({ resetPassToken, resetPassExpiresAt: { $gt: new Date() } });

    if (!user) throw new CustomError('Invalid or expired reset token', 400);

    user.password = password;
    user.reset_pass_token = undefined;
    user.reset_pass_expires_at = undefined;
    await user.save();

    await sendMail({
        to: user.email,
        subject: 'Password reset successfully',
        tempFn: passResetSuccessTemp
    });

    res.status(200).send({
        success: true,
        message: 'Password reset successfully'
    });
};