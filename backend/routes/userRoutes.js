const express = require("express");
const router = express.Router();
const { updateProfile, getUsers, toggleUserStatus } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", protect, authorize("admin"), getUsers);
router.put("/profile", protect, upload.single("profileImage"), updateProfile);
router.put("/:id/toggle-status", protect, authorize("admin"), toggleUserStatus);

module.exports = router;
