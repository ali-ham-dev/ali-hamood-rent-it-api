import initKnex from 'knex';
import configuration from '../../../../knexfile.js';
import { logError } from '../../../../utils/logger.js';
import assetsModel from '../model/assets-model.js';
import authModel from '../model/auth-model.js';

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

const uploadMedia = async (req, res) => {
    try {
        const upload = assetsModel.getUploadMulter().single('file');

        upload(req, res, async (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return res.status(400).json({
                            message: `File size exceeds the limit of ${process.env.MAX_FILE_SIZE || 5}MB`
                        });
                    }
                    return res.status(400).json({
                        message: 'Error uploading file'
                    });
                }

                return res.status(400).json({
                    message: err.message
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    message: 'No file uploaded'
                });
            }

            const [assetId] = await knex('assets').insert({
                // filename: req.file.filename,
                // originalname: req.file.originalname,
                // mimetype: req.file.mimetype,
                // size: req.file.size,
                // path: req.file.path
            });

            res.status(200).json({
                message: 'Asset uploaded successfully',
                assetId,
                file: {
                    filename: req.file.filename,
                    originalname: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size
                }
            });
        });
    } catch (error) {
        logError(error, 'uploading asset');
        res.status(500).json({
            message: 'Error uploading asset'
        });
    }
};

const uploadAssetDetails = async (req, res) => {
    try {
        const assetDetails = req.body;
        const user = req.user;
        const [id] = await knex('assets')
            .insert({
                title: assetDetails.title,
                media: JSON.stringify([]),
                price: assetDetails.price,
                period: assetDetails.period,
                description: assetDetails.description,
                is_rented: false,
                user_id: user.userId
            });
        if (!id) {
            return res.status(500).json({ error: 'Error uploading asset details' });
        }
        return res.status(200).json({ 
            message: 'Asset details uploaded successfully',
            assetId: id
        });
    } catch (error) {
        logError(error, 'uploading asset details');
        return res.status(500).json({
            message: 'Error uploading asset details'
        });
    }
}

export { 
    getAsset, 
    getAssets,
    uploadMedia,
    uploadAssetDetails
};