import express from 'express';
import * as authController from './controllers/auth-controller.js';

const authRouter = express.Router();

authRouter
    .post('/signup', authController.signup)
    .post('/login-password', authController.loginWithPassword)
    .post('/login-email-token', authController.loginWithEmailToken)
    .get('/verify-email-token/:userId/:token', authController.verifyEmailToken)
    .post('/resend-verification-token/:userId', authController.resendVerificationToken);

export default authRouter;