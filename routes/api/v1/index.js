import express from 'express';
import authRouter from './auth-router.js';
import assetsRouter from './assets-router.js';
import fileExtensionsRouter from './file-extensions-router.js';

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/assets', assetsRouter);
v1Router.use('/file-extensions', fileExtensionsRouter);

export default v1Router;
