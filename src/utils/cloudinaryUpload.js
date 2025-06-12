const cloudinary = require('cloudinary').v2;

const uploadImageToCloudinary = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'SurfStore'
    });
    return result.secure_url;
  } catch (error) {
    throw error;
  }
};

module.exports = { uploadImageToCloudinary };
