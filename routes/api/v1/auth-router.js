import express from 'express';
import * as authController from './controllers/auth-controller.js';

const authRouter = express.Router();

authRouter
    .post('/signup', authController.signup)
    .post('/login', authController.login)
    .get('/verify-email-token/:userId/:token', authController.verifyEmailToken)
    .post('/resend-verification-token', authController.resendVerificationToken);

export default authRouter;