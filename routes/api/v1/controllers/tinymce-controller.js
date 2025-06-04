import { logError } from '../../../../utils/logger.js';
import tinymceModel from '../model/tinymce-model.js';

const getAuthToken = async (req, res) => {
    try {
        const authToken = tinymceModel.generateJwtSessionToken();

        if (!authToken) {
            return res.status(500).json({ error: 'Error generating tinyMCE session token' });
        }

        res.status(200).json({ authToken: authToken });
    } catch (error) {
        logError(error, 'getAuthToken');
        res.status(500).json({ error: 'Error getting auth token' });
    }
};

const getAPIKey = async (req, res) => {
    try {
        const apiKey = tinymceModel.getAPIKey();

        if (!apiKey) {
            return res.status(500).json({ error: 'Error getting tinyMCE API key' });
        }

        res.status(200).json({ apiKey: apiKey });
    } catch (error) {
        logError(error, 'getAPIKey');
        res.status(500).json({ error: 'Error getting API key' });
    }
};

export {
    getAuthToken, 
    getAPIKey
}