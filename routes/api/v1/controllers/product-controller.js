import initKnex from 'knex';
import configuration from '../../../../knexfile.js';
import { logError } from '../../../../utils/logger.js';

const kenx = initKnex(configuration);

const getProduct = async (req, res) => {
    try {
        const product = await kenx('products')
            .where('id', req.params.productId)
            .select('*');
        
        if (!product.length) {
            return res.status(404).json({
                message: `Product with id ${req.params.productId} not found`
            });
        }

        res.status(200).json(product[0]);
    } catch (error) {
        logError(error, `retrieving product with id ${req.params.productId}`);

        res.status(500).json({
            message: `Error retrieving product with id ${req.params.productId}`
        });
    }
}

export { getProduct };