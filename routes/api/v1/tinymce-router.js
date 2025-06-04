import express from 'express';
import * as tinymceController from './controllers/tinymce-controller.js';
import rateLimit from 'express-rate-limit';
import tinymceModel from './model/tinymce-model.js';
import authModel from './model/auth-model.js';

const tinymceRouter = express.Router();

const tinymceLimiter = rateLimit({
    windowMs: tinymceModel.RATE_LIMIT_DURATIONS.TINYMCE_DURATION,
    limit: tinymceModel.RATE_LIMIT_RULES.TINYMCE_LIMIT,
    message: 'Too many tinymce attempts, please try again later.'
});

const validateJwtToken = (req, res, next) => {
    const result = authModel.checkForJwtInRequestHeader(req.headers);
    if (!result.valid) {
        return res.status(400).json({ error: result.error });
    }
    req.user = result.decoded;
    next();
};

tinymceRouter
    .route('/auth-token')
        .get(tinymceLimiter, validateJwtToken, tinymceController.getAPIKey); 


export default tinymceRouter;