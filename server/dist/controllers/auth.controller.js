"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgetPassword = exports.verifyEmail = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const env_1 = __importDefault(require("../configs/env"));
const user_model_1 = __importDefault(require("../models/user.model"));
const common_1 = require("../utils/common");
const emailTemplates_1 = require("../utils/emailTemplates");
const node_crypto_1 = __importDefault(require("node:crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    const { email } = req.body;
    const exists = await user_model_1.default.exists({ email });
    if (exists)
        throw new common_1.CustomError('User already exists', 409, true);
    const user = await user_model_1.default.create(req.body);
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
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await user_model_1.default.findOne({ email, password });
    if (!user)
        throw new common_1.CustomError('Invalid email or password', 401, true);
    // if (!user.isVerified) throw new CustomError('Email not verified', 403, true);
    user.last_login = new Date();
    await user.save();
    res.status(200).send((0, common_1.setToken)(user));
};
exports.login = login;
const refresh = async (req, res) => {
    console.log('refresh calisit');
    const refreshToken = req.body?.refresh;
    if (!refreshToken)
        throw new common_1.CustomError('Please enter token.refresh', 401, true);
    const decoded = jsonwebtoken_1.default.verify(refreshToken, env_1.default.JWT_REFRESH_SECRET);
    if (!decoded?.id)
        throw new common_1.CustomError('Invalid token: missing id.', 403, true);
    const user = await user_model_1.default.findOne({ _id: decoded.id }).lean();
    if (!user)
        throw new common_1.CustomError('User not found.', 404, true);
    res.status(200).send((0, common_1.setToken)(user, true));
};
exports.refresh = refresh;
const logout = async (req, res) => {
    res.status(200).send({ success: true, message: 'Logged out successfully' });
};
exports.logout = logout;
const verifyEmail = async (req, res) => {
    const { verificationToken } = req.body;
    const user = await user_model_1.default.findOne({ verificationToken, verificationTokenExpiresAt: { $gt: new Date() } });
    if (!user)
        throw new common_1.CustomError('Invalid or expired verification token', 400);
    user.is_verified = true;
    user.verification_token = undefined;
    user.verification_token_expires_at = undefined;
    await user.save();
    (0, common_1.sendMail)({
        to: user.email,
        subject: 'Email verified successfully',
        tempFn: emailTemplates_1.welcomeEmailTemp
    });
    res.status(200).send({
        success: true,
        message: 'Email verified successfully'
    });
};
exports.verifyEmail = verifyEmail;
const forgetPassword = async (req, res) => {
    const { email } = req.body;
    const user = await user_model_1.default.findOne({ email });
    if (!user)
        throw new common_1.CustomError('User not found', 404, true);
    if (!user.is_verified)
        throw new common_1.CustomError('User email is not verified. Please verify your email.', 403, true);
    user.reset_pass_token = node_crypto_1.default.randomBytes(20).toString('hex');
    user.reset_pass_expires_at = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours later
    await user.save();
    await (0, common_1.sendMail)({
        to: user.email,
        subject: 'Reset your password',
        tempFn: emailTemplates_1.passResetReqTemp,
        data: { resetURL: env_1.default.FRONTEND_URL + '/reset-password/' + user.reset_pass_token }
    });
    res.status(200).send({
        success: true,
        message: 'Password reset link sent to your email'
    });
};
exports.forgetPassword = forgetPassword;
const resetPassword = async (req, res) => {
    const { resetPassToken } = req.params;
    const { password } = req.body;
    const user = await user_model_1.default.findOne({ resetPassToken, resetPassExpiresAt: { $gt: new Date() } });
    if (!user)
        throw new common_1.CustomError('Invalid or expired reset token', 400);
    user.password = password;
    user.reset_pass_token = undefined;
    user.reset_pass_expires_at = undefined;
    await user.save();
    await (0, common_1.sendMail)({
        to: user.email,
        subject: 'Password reset successfully',
        tempFn: emailTemplates_1.passResetSuccessTemp
    });
    res.status(200).send({
        success: true,
        message: 'Password reset successfully'
    });
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.controller.js.map