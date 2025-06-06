import express from 'express';
import * as assetsController from './controllers/assets-controller.js';
import authModel from './model/auth-model.js';
import assetsModel from './model/assets-model.js';
import rateLimit from 'express-rate-limit';

const assetsRouter = express.Router();

const myAssetsLimiter = rateLimit({
    windowMs: assetsModel.RATE_LIMIT_DURATIONS.GENERAL_DURATION,
    limit: assetsModel.RATE_LIMIT_RULES.GENERAL_LIMIT,
    message: 'Too many my assets attempts, please try again later.'
});

const validateJwtToken = (req, res, next) => {
    const result = authModel.checkForJwtInRequestHeader(req.headers);
    if (!result.valid) {
        return res.status(400).json({ error: result.error });
    }
    req.user = result.decoded;
    next();
};

assetsRouter
    .route('/')
    .get(myAssetsLimiter, assetsController.getAssets);

assetsRouter
    .route('/:assetsId')
    .get(myAssetsLimiter, assetsController.getAsset);

assetsRouter
    .route('/upload/media/:assetsId')
    .all(validateJwtToken)
    .post(myAssetsLimiter, assetsController.uploadMedia);

assetsRouter
    .route('/upload/asset')
    .all(validateJwtToken)
    .post(myAssetsLimiter, assetsController.uploadAssetDetails);

export default assetsRouter;