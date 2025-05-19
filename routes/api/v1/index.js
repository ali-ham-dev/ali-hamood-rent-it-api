import express from 'express';
import productRouter from './product-router.js';
import fileExtensionsRouter from './file-extensions-router.js';

const v1Router = express.Router();

v1Router.use('/products', productRouter);
v1Router.use('/file-extensions', fileExtensionsRouter);

export default v1Router;
