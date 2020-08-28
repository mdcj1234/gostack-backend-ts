import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
const uploadsFolder = path.resolve(tmpFolder, 'uploads');

interface IUploadConfig {
    driver: 's3' | 'disk';
    tmpFolder: string;
    uploadsFolder: string;

    multer: {
        storage: StorageEngine;
    };

    config: {
        disk: {};
        aws: {
            bucket: string;
            url: string;
        };
    };
}

export default {
    driver: process.env.STORAGE_DRIVER,

    tmpFolder,
    uploadsFolder,

    multer: {
        storage: multer.diskStorage({
            destination: tmpFolder,
            filename(request, file, callback) {
                const fileHash = crypto.randomBytes(10).toString('hex');
                const filename = `${fileHash}-${file.originalname}`;

                return callback(null, filename);
            },
        }),
    },

    config: {
        disk: {},
        aws: {
            bucket: 'marciojr-gobarber',
            url: 'https://marciojr-gobarber.s3.amazonaws.com',
        },
    },
} as IUploadConfig;
