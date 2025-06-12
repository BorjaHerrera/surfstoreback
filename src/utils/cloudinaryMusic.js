const cloudinary = require('cloudinary').v2;

const musicCloudinary = async (audioPath) => {
  try {
    const result = await cloudinary.uploader.upload(audioPath, {
      folder: 'SurfStoreMusic',
      resource_type: 'video'
    });
    return result.secure_url;
  } catch (error) {
    throw error;
  }
};

module.exports = { musicCloudinary };
