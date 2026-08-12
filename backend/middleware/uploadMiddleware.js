const multer = require("multer");

// Images are held in memory only (never written to disk) and then uploaded
// directly to Cloudinary by the controller that handles the request. This
// avoids relying on any local disk — essential on hosts like Render, whose
// free-tier filesystem is ephemeral and wipes local files on every restart.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extValid = allowedTypes.test(file.originalname.toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype);
  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;