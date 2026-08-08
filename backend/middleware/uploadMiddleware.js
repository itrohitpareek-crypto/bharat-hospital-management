const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary-v2");
const cloudinary = require("../config/cloudinary");

// Images are uploaded straight to Cloudinary instead of the server's local
// disk. This is essential on hosts like Render, whose free-tier filesystem
// is ephemeral — anything saved locally is wiped on every restart/redeploy.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bharat-hospital",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;