import { logError } from '../../../../utils/logger.js';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

class AssetsModel {

    constructor() {
        this.RATE_LIMIT_RULES = {
            GENERAL_LIMIT: 10000,
        };

        this.RATE_LIMIT_DURATIONS = {
            GENERAL_DURATION: 15 * 60 * 1000,
        };
    }

    getImageMimeTypes() {
        return process.env.IMG_EXT.split(',').map(ext => `image/${ext}`);
        console.log(imageMimeTypes);
    }

    getVideoMimeTypes() {
        return process.env.VID_EXT.split(',').map(ext => `video/${ext}`);
        console.log(videoMimeTypes);
    }

    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const assetId = parseInt(req.params.assetId);
            if (!assetId || isNaN(assetId)) {
                return cb(new Error('Invalid or missing asset ID'), null);
            }
            const uploadPath = path.join(process.env.ROOT_DIR, process.env.MEDIA_UPLOAD_DIR, assetId.toString());
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now();
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            const sanitizedBasename = basename
                .replace(/\s+/g, '-')
                .replace(/[^a-zA-Z0-9-_]/g, '')
                .toLowerCase();
            cb(null, `${sanitizedBasename}-${timestamp}${ext}`);
        }
    });

    limits = {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5') * 1024 * 1024 // 5MB
    };

    fileFilter = (req, file, cb) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'];

        if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);    
        }
    };

    upload = multer({
        storage: this.storage,
        limits: this.limits,
        fileFilter: this.fileFilter
    });
}

export default new AssetsModel();
