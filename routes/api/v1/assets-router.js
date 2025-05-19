import express from 'express';
import * as assetsController from './controllers/assets-controller.js';

const assetsRouter = express.Router();

assetsRouter
    .route('/:assetsId')
    .get(assetsController.getAssets);

export default assetsRouter;