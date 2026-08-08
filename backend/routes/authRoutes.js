const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe, changePassword, googleAuth, forgotPassword, resetPassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/me", protect, getMe);
router.put("/change-password", protect, changePassword);

module.exports = router;