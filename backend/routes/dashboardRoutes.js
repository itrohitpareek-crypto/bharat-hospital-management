const express = require("express");
const router = express.Router();
const { getAdminStats, getDoctorStats, getPatientStats } = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/admin", protect, authorize("admin"), getAdminStats);
router.get("/doctor", protect, authorize("doctor"), getDoctorStats);
router.get("/patient", protect, authorize("patient"), getPatientStats);

module.exports = router;
