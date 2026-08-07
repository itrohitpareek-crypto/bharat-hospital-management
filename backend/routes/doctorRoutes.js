const express = require("express");
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorAppointments,
  getDoctorSlots,
} = require("../controllers/doctorController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.get("/:id/slots", getDoctorSlots);
router.get("/:id/appointments", protect, authorize("admin", "doctor"), getDoctorAppointments);
router.post("/", protect, authorize("admin"), createDoctor);
router.put("/:id", protect, authorize("admin", "doctor"), updateDoctor);
router.delete("/:id", protect, authorize("admin"), deleteDoctor);

module.exports = router;