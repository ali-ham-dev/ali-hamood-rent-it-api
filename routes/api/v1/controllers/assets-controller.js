import initKnex from 'knex';
import configuration from '../../../../knexfile.js';
import { logError } from '../../../../utils/logger.js';
import assetsModel from '../model/assets-model.js';
import authModel from '../model/auth-model.js';
import multer from 'multer';

const knex = initKnex(configuration);

// TODO: add validation for asset details

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

const getAssetsForRent = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        const userAssets = await knex('assets')
            .where('user_id', user.userId)
            .select('*');

        if (!userAssets || !userAssets.length) {
            return res.status(404).json({
                message: 'No assets found'
            });
        }

        return res.status(200).json(userAssets);
    } catch (error) {
        logError(error, 'retrieving assets for rent');
        return res.status(500).json({
            message: 'Error retrieving assets for rent'
        });
    }
}

const getRentedAssets = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        const rentedAssets = await knex('assets')
            .where('rented_by_user_id', user.userId)
            .select('*');
        
        if (!rentedAssets || !rentedAssets.length) {
            return res.status(404).json({
                message: 'No rented assets found'
            });
        }

        const rentedAssetsFiltered = rentedAssets.filter((asset) => asset.is_rented);
        return res.status(200).json(rentedAssetsFiltered);
    } catch (error) {
        logError(error, 'retrieving rented assets');
        return res.status(500).json({
            message: 'Error retrieving rented assets'
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

            const assetId = req.params.assetsId;
            const currMedia = await knex('assets')
                .where('id', assetId)
                .select('media')
                .first();
            if (!currMedia) {
                return res.status(404).json({
                    message: 'Asset not found'
                });
            }

            const mediaLink = assetsModel.makeMediaUrl(req.file.filename, assetId);
            await knex('assets')
                .where('id', assetId)
                .update({
                    media: JSON.stringify([...currMedia.media, mediaLink]),
                });

            return res.status(200).json({
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
        return res.status(500).json({
            message: 'Error uploading asset'
        });
    }
};

const editMedia = async (req, res) => {
    try {
        const assetId = req.params.assetsId;
        const media = req.body.media;
        const user = req.user;

        if (!user || !assetId || !media) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        const asset = await knex('assets')
            .where('id', assetId)
            .select('*')
            .first();

        if (!asset) {
            return res.status(404).json({
                message: 'Asset not found'
            });
        }

        if (asset.user_id !== user.userId) {
            return res.status(403).json({
                message: 'Unauthorized'
            });
        }

        if (asset.is_rented) {
            return res.status(403).json({
                message: 'Asset is rented'
            });
        }

        console.log('editing media');

        await knex('assets')
            .where('id', assetId)
            .update({
                media: JSON.stringify(media),
            });
        
        return res.status(200).json({
            message: 'Media edited successfully',
            assetId: assetId
        });
    } catch (error) {
        logError(error, 'editing media');
        return res.status(500).json({
            message: 'Error editing media'
        });
    }
}
 
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
                description: assetsModel.sanitizeDescription(assetDetails.description),
                is_rented: false,
                user_id: user.userId,
                rented_by_user_id: user.userId
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

const editAssetDetails = async (req, res) => {
    try {
        const user = req.user;
        const assetId = req.params.assetsId;
        const assetDetails = req.body;

        if (!user || !assetId || !assetDetails) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        const asset = await knex('assets')
            .where('id', assetId)
            .select('*')
            .first();

        if (!asset) {
            return res.status(404).json({
                message: 'Asset not found'
            });
        }

        if (asset.user_id !== user.userId) {
            return res.status(403).json({
                message: 'Unauthorized'
            });
        }

        await knex('assets')
            .where('id', assetId)
            .update({
                title: assetDetails.title,
                price: assetDetails.price,
                period: assetDetails.period,
                description: assetsModel.sanitizeDescription(assetDetails.description),
            });
        
        return res.status(200).json({
            message: 'Asset details edited successfully',
            assetId: assetId
        });
        
    } catch (error) {
        logError(error, 'editing asset details');
        return res.status(500).json({
            message: 'Error editing asset details'
        });
    }
}

const deleteAsset = async (req, res) => {
    try {
        const assetId = req.params.assetId;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        const asset = await knex('assets')
            .where('id', assetId)
            .select('*')
            .first();

        if (!asset) {
            return res.status(404).json({
                message: 'Asset not found'
            });
        }

        if (asset.user_id !== user.userId) {
            return res.status(403).json({
                message: 'Unauthorized'
            });
        }

        if (asset.is_rented) {
            return res.status(403).json({
                message: 'Asset is rented'
            });
        }

        assetsModel.deleteAssetFiles(assetId);

        await knex('assets')
            .where('id', assetId)
            .delete();

        return res.status(200).json({
            message: 'Asset deleted successfully'
        });
    } catch (error) {
        logError(error, 'deleting asset');
        return res.status(500).json({
            message: 'Error deleting asset'
        });
    }
}

const startRent = async (req, res) => {
    try {
        console.log('starting rent');
        const assetId = req.params.assetId;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        const asset = await knex('assets')
            .where('id', assetId)
            .select('*')
            .first();

        if (!asset) {
            return res.status(404).json({
                message: 'Asset not found'
            });
        }

        if (asset.is_rented) {
            return res.status(403).json({
                message: 'Asset is already rented'
            });
        }

        const owner = await knex('users')
            .where('id', asset.user_id)
            .select('*')
            .first();
        
        if (!owner) {
            return res.status(404).json({
                message: 'Owner not found'
            });
        }

        await knex('assets')
            .where('id', assetId)
            .update({
                is_rented: true,
                rented_by_user_id: user.userId
            });

        return res.status(200).json({
            message: 'Asset rented successfully',
            assetId: assetId,
            overEmail: owner.email,
            overName: owner.name,
            ownerLastName: owner.last_name,
            ownerPhone: owner.phone,
        });
    } catch (error) {
        logError(error, 'starting rent');
        return res.status(500).json({
            message: 'Error starting rent'
        });
    }
}

const endRent = async (req, res) => {
    try {
        const assetId = req.params.assetId;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        const asset = await knex('assets')
            .where('id', assetId)
            .select('*')
            .first();

        if (!asset) {
            return res.status(404).json({
                message: 'Asset not found'
            });
        }

        if (!asset.is_rented) {
            return res.status(403).json({
                message: 'Asset is not rented'
            });
        }

        if (asset.rented_by_user_id !== user.userId) {
            return res.status(403).json({
                message: 'You are not the renter of this asset'
            });
        }

        await knex('assets')
            .where('id', assetId)
            .update({
                is_rented: false,
                rented_by_user_id: asset.user_id
            });

        return res.status(200).json({
            message: 'Asset rent ended successfully'
        });
    } catch (error) {
        logError(error, 'ending rent');
        return res.status(500).json({
            message: 'Error ending rent'
        });
    }
}

export { 
    getAsset, 
    getAssets,
    uploadMedia,
    editMedia,
    uploadAssetDetails,
    editAssetDetails,
    getAssetsForRent,
    getRentedAssets,
    deleteAsset,
    startRent,
    endRent
};