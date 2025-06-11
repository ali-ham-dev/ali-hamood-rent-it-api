import initKnex from 'knex';
import configuration from '../../../../knexfile.js';
import { logError } from '../../../../utils/logger.js';

const knex = initKnex(configuration);

// TODO: Remove file extensions table from db.

const getImageFileExtensions = async (req, res) => {
    try { 
        const imgExtStr = process.env.IMG_EXT;
        const imgExtObj = JSON.parse(imgExtStr);
        const imgExtAry = [];
        imgExtObj.forEach(ext => {
            imgExtAry.push(ext);
        });
        if (!imgExtAry.length) {
            return res.status(404).json({
                message: 'No image file extensions found'
            });
        }
        res.status(200).json(imgExtAry);
    } catch (error) {
        logError(error, 'retrieving image file extensions');

        res.status(500).json({
            message: 'Error retrieving image file extensions'
        });
    }
}

const getVideoFileExtensions = async (req, res) => {
    try {
        const vidExtStr = process.env.VID_EXT;
        const vidExtObj = JSON.parse(vidExtStr);
        const vidExtAry = [];
        vidExtObj.forEach(ext => {
            vidExtAry.push(ext);
        });
        if (!vidExtAry.length) {
            return res.status(404).json({
                message: 'No video file extensions found'
            });
        }
        res.status(200).json(vidExtAry);
    } catch (error) {
        logError(error, 'retrieving video file extensions');

        res.status(500).json({
            message: 'Error retrieving video file extensions'
        });
    }
}

export { getImageFileExtensions, getVideoFileExtensions };