import express from 'express';
import * as assetsController from './controllers/assets-controller.js';
import authModel from './model/auth-model.js';

const assetsRouter = express.Router();

// TODO: Rate limiters

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
    .get(assetsController.getAssets);

assetsRouter
    .route('/:assetsId')
    .get(assetsController.getAsset);

assetsRouter
    .route('/upload/media')
    .all(validateJwtToken)
    .post(assetsController.uploadAsset);

export default assetsRouter;