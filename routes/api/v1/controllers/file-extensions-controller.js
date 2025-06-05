import initKnex from 'knex';
import configuration from '../../../../knexfile.js';
import { logError } from '../../../../utils/logger.js';

const knex = initKnex(configuration);

const getImageFileExtensions = async (req, res) => {
    try {
        const imageFileExtensions = await knex('image_file_extensions')
            .select('*');

        if (!imageFileExtensions.length) {
            return res.status(404).json({
                message: 'No image file extensions found'
            });
        }

        res.status(200).json(imageFileExtensions);

        console.log(res.body);
    } catch (error) {
        logError(error, 'retrieving image file extensions');

        res.status(500).json({
            message: 'Error retrieving image file extensions'
        });
    }
}

const getVideoFileExtensions = async (req, res) => {
    try {
        const videoFileExtensions = await knex('video_file_extensions')
            .select('*');

        if (!videoFileExtensions.length) {
            return res.status(404).json({
                message: 'No video file extensions found'
            });
        }

        res.status(200).json(videoFileExtensions);
        console.log(res.body);
    } catch (error) {
        logError(error, 'retrieving video file extensions');

        res.status(500).json({
            message: 'Error retrieving video file extensions'
        });
    }
}

export { getImageFileExtensions, getVideoFileExtensions };