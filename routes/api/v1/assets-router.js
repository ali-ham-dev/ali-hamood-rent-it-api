import express from 'express';
import * as assetsController from './controllers/assets-controller.js';

const assetsRouter = express.Router();

assetsRouter
    .route('/')
    .get(assetsController.getAssets);

assetsRouter
    .route('/:assetsId')
    .get(assetsController.getAsset);

export default assetsRouter;