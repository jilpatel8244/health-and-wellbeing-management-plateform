const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        format: async (req, file) => path.extname(file.originalname).slice(1),
        public_id: (req, file) => file.fieldname + '-' + Date.now()
    }
});

const upload = multer({ storage: storage });

module.exports = upload;