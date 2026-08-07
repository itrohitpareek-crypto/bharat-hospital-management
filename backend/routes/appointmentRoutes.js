const express = require("express");
const router = express.Router();
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, getAppointments);
router.post("/", protect, authorize("patient", "admin"), createAppointment);
router.put("/:id", protect, authorize("admin", "doctor"), updateAppointment);
router.delete("/:id", protect, deleteAppointment);

module.exports = router;
