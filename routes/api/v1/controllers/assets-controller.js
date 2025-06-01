import initKnex from 'knex';
import configuration from '../../../../knexfile.js';
import { logError } from '../../../../utils/logger.js';

const knex = initKnex(configuration);

const getAssets = async (req, res) => {
    try {
        const assets = await knex('assets')
            .select('id');
        
        if (!assets.length) {
            return res.status(500).json({
                message: `Error retrieving assets`
            });
        }

        res.status(200).json(assets);
    } catch (error) {
        logError(error, `Error retrieving assets`);

        res.status(500).json({
            message: `Error retrieving assets`
        });
    }
}

const getAsset = async (req, res) => {
    try {
        const asset = await knex('assets')
            .where('id', req.params.assetsId)
            .select('*');
        
        if (!asset.length) {
            return res.status(404).json({
                message: `Asset with id ${req.params.assetsId} not found`
            });
        }

        res.status(200).json(asset[0]);
    } catch (error) {
        logError(error, `retrieving asset with id ${req.params.assetsId}`);

        res.status(500).json({
            message: `Error retrieving assets with id ${req.params.assetsId}`
        });
    }
}

export { 
    getAsset, 
    getAssets 
};