import initKnex from 'kenx';
import configuration from '../knexfile.js';
import { logError } from '../utils/error-logger.js';

const kenx = initKnex(configuration);

const getProduct = async (req, res) => {
    try {
        const product = await kenx('products')
            .where('id', req.params.productId)
            .select('*');
        
        if (!product.lenth) {
            return res.status(404).json({
                message: `Product with id ${req.params.productId} not found`
            });
        }

        res.status(200).json(product);
    } catch (error) {
        logError(error, `retrieving product with id ${req.params.productId}`);

        res.status(500).json({
            message: `Error retrieving product with id ${req.params.productId}`
        });
    }
}