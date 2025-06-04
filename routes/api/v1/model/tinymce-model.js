import { logError } from '../../../../utils/logger.js';
import jwt from 'jsonwebtoken';

class TinymceModel {

    constructor() {
        this.RATE_LIMIT_RULES = {
            TINYMCE_LIMIT: 10000,
        };

        this.RATE_LIMIT_DURATIONS = {
            TINYMCE_DURATION: 15 * 60 * 1000,
        };

        this.sessionExpiresIn = process.env.TINY_MCE_EXPIRES_IN;
    }

    getPrivateKey() {
        return process.env.TINY_MCE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    }

    getAPIKey() {
        return process.env.TINY_MCE_API_KEY;
    }

    generateJwtSessionToken() {
        const expiresIn = Math.floor(Date.now() / 1000) + parseInt(this.sessionExpiresIn);
        return jwt.sign(
            { 
                aud: 'tiny.cloud',
                iss: '',
                sub: 'jd32hjs3',
                exp: expiresIn,
            },
            this.getPrivateKey(),
            { 
                algorithm: 'RS256',
            }
        );
    }
}

export default new TinymceModel();
