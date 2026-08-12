const cloudinary = require("../config/cloudinary");

/**
 * Uploads an in-memory file buffer (from multer's memoryStorage) to Cloudinary
 * and resolves with the public HTTPS URL of the uploaded image.
 */
const uploadToCloudinary = (fileBuffer, folder = "bharat-hospital") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 800, height: 800, crop: "limit" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = uploadToCloudinary;