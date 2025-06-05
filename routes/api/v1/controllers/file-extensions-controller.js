import initKnex from 'knex';
import configuration from '../../../../knexfile.js';
import { logError } from '../../../../utils/logger.js';

const knex = initKnex(configuration);

// TODO: Remove file extensions table from db.

const getImageFileExtensions = async (req, res) => {
    try {
        const imageFileExtensions = process.env.IMG_EXT;

        console.log(imageFileExtensions);

        if (!imageFileExtensions.length) {
            return res.status(404).json({
                message: 'No image file extensions found'
            });
        }

        res.status(200).json(imageFileExtensions);
    } catch (error) {
        logError(error, 'retrieving image file extensions');

        res.status(500).json({
            message: 'Error retrieving image file extensions'
        });
    }
}

const getVideoFileExtensions = async (req, res) => {
    try {
        const videoFileExtensions = process.env.VID_EXT;

        console.log(videoFileExtensions);

        if (!videoFileExtensions.length) {
            return res.status(404).json({
                message: 'No video file extensions found'
            });
        }

        res.status(200).json(videoFileExtensions);
    } catch (error) {
        logError(error, 'retrieving video file extensions');

        res.status(500).json({
            message: 'Error retrieving video file extensions'
        });
    }
}

export { getImageFileExtensions, getVideoFileExtensions };