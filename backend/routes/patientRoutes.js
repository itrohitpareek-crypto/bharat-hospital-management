const express = require("express");
const router = express.Router();
const {
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientSummary,
} = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin", "doctor"), getPatients);
router.get("/:id", protect, getPatientById);
router.get("/:id/summary", protect, getPatientSummary);
router.put("/:id", protect, updatePatient);
router.delete("/:id", protect, authorize("admin"), deletePatient);

module.exports = router;
