const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'SurfStoreMusic',
    resource_type: 'video',
    allowedFormats: ['mp3', 'wav', 'ogg', 'm4a']
  }
});

const musicUpload = multer({ storage });
module.exports = musicUpload;
