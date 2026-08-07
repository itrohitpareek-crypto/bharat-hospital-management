const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/settingsController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getSettings);
router.put("/", protect, authorize("admin"), upload.single("logo"), updateSettings);

module.exports = router;
