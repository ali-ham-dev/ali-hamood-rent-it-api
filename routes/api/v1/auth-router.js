import express from 'express';
import * as authController from './controllers/auth-controller.js';
import rateLimit from 'express-rate-limit';
import authModel from './model/auth-model.js';
const authRouter = express.Router();

const loginLimiter = rateLimit({
    windowMs: authModel.RATE_LIMIT_DURATIONS.LOGIN_DURATION,
    limit: authModel.RATE_LIMIT_RULES.LOGIN_LIMIT,
    message: 'Too many login attempts, please try again later.'
});

const signupLimiter = rateLimit({
    windowMs: authModel.RATE_LIMIT_DURATIONS.SIGNUP_DURATION,
    limit: authModel.RATE_LIMIT_RULES.SIGNUP_LIMIT,
    message: 'Too many signup attempts, please try again later.'
});

const verifyEmailLimiter = rateLimit({
    windowMs: authModel.RATE_LIMIT_DURATIONS.VERIFY_EMAIL_DURATION,
    limit: authModel.RATE_LIMIT_RULES.VERIFY_EMAIL_LIMIT,
    message: 'Too many verify email attempts, please try again later.'
});

const checkEmailLimiter = rateLimit({
    windowMs: authModel.RATE_LIMIT_DURATIONS.CHECK_EMAIL_DURATION,
    limit: authModel.RATE_LIMIT_RULES.CHECK_EMAIL_LIMIT,
    message: 'Too many check email attempts, please try again later.'
});

authRouter
    .post('/signup', signupLimiter, authController.signup)
    .post('/check-email', checkEmailLimiter, authController.checkEmail)
    .post('/login-password', loginLimiter, authController.loginWithPassword)
    .post('/login-email-token', loginLimiter, authController.loginWithEmailToken)
    .post('/verify-email-token/:userId/:token', verifyEmailLimiter, authController.verifyEmailToken)
    .post('/resend-verification-token/:userId', verifyEmailLimiter, authController.resendVerificationToken);

export default authRouter;