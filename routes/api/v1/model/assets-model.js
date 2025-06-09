import { logError } from '../../../../utils/logger.js';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

class AssetsModel {
    window = new JSDOM('').window;
    DOMPurify = createDOMPurify(this.window);

    constructor() {
        this.RATE_LIMIT_RULES = {
            GENERAL_LIMIT: 10000,
        };

        this.RATE_LIMIT_DURATIONS = {
            GENERAL_DURATION: 15 * 60 * 1000,
        };
    }

    getImageMimeTypes() {
        const imgExtStr = process.env.IMG_EXT;
        const imgExtObj = JSON.parse(imgExtStr);
        const extAry = [];
        for (const ext of imgExtObj) {
            extAry.push(`image/${ext}`);
        }
        return extAry;
    }

    getVideoMimeTypes() {
        const vidExtStr = process.env.VID_EXT;
        const vidExtObj = JSON.parse(vidExtStr);
        const extAry = [];
        for (const ext of vidExtObj) {
            extAry.push(`video/${ext}`);
        }
        return extAry;
    }

    makeMediaUrl = (filename, assetId) => {
        if (process.env.SERVER_ENV === 'dev') {
            return `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}${process.env.MEDIA_DOWNLOAD_DIR}/${assetId}/${filename}`;
        } else {
            return `https://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}${process.env.MEDIA_DOWNLOAD_DIR}/${assetId}/${filename}`;
        }
    }

    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const assetId = parseInt(req.params.assetsId);
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
        const allowedImageTypes = this.getImageMimeTypes();
        const allowedVideoTypes = this.getVideoMimeTypes();

        if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);    
        }
    };

    getUploadMulter() {
        return multer({
            storage: this.storage,
            limits: this.limits,
            fileFilter: this.fileFilter
        });
    }

    deleteAssetFiles(assetId) {
        const mediaDir = path.join(process.env.ROOT_DIR, process.env.MEDIA_UPLOAD_DIR, assetId.toString());
        if (fs.existsSync(mediaDir)) {
            fs.rmSync(mediaDir, { recursive: true, force: true });
        }
    }

    sanitizeDescription(description) {
        return this.DOMPurify.sanitize(description, {
            ALLOWED_TAGS: [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
                'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'span', 'img'
            ],
            ALLOWED_ATTR: ['href', 'name', 'target', 'src', 'alt', 'class', 'style'],
            ALLOWED_STYLES: ['color', 'text-align', 'font-size', 'font-weight', 'font-style', 'text-decoration'],
            ALLOW_DATA_ATTR: false,
            ADD_ATTR: ['target'],
            ADD_TAGS: ['img'],
            FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
            FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onkeydown', 'onkeyup', 'onkeypress']
        });
    }
}

export default new AssetsModel();
