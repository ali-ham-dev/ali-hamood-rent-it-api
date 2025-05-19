import express from 'express';
import * as fileExtensionsController from './controllers/file-extensions-controller.js';

const fileExtensionsRouter = express.Router();


fileExtensionsRouter
    .route('/image-file-extensions')
    .get(fileExtensionsController.getImageFileExtensions);

fileExtensionsRouter
    .route('/video-file-extensions')
    .get(fileExtensionsController.getVideoFileExtensions);

export default fileExtensionsRouter;