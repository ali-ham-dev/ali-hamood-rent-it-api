import initKnex from 'knex';
import configuration from '../../../../knexfile.js';
import { logError } from '../../../../utils/logger.js';

const kenx = initKnex(configuration);

const getAssets = async (req, res) => {
    try {
        const assets = await kenx('assets')
            .where('id', req.params.assetsId)
            .select('*');
        
        if (!assets.length) {
            return res.status(404).json({
                message: `Assets with id ${req.params.assetsId} not found`
            });
        }

        res.status(200).json(assets[0]);
    } catch (error) {
        logError(error, `retrieving assets with id ${req.params.assetsId}`);

        res.status(500).json({
            message: `Error retrieving assets with id ${req.params.assetsId}`
        });
    }
}

export { getAssets };