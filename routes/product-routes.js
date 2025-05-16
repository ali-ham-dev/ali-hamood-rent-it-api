import express from 'express';
import * as productController from '../controllers/product-controller.js';

const productRouter = express.Router();

productRouter
    .route('/:productId')
    .get(productController.getProduct);

export default productRouter;