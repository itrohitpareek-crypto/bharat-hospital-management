const asyncHandler = require("express-async-handler");
const Patient = require("../models/Patient");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Bill = require("../models/Bill");

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private/Admin/Doctor
const getPatients = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;

  let patients = await Patient.find()
    .populate("user", "name email phone profileImage gender dateOfBirth isActive")
    .sort({ createdAt: -1 });

  if (search) {
    const s = search.toLowerCase();
    patients = patients.filter(
      (p) => p.user?.name?.toLowerCase().includes(s) || p.user?.email?.toLowerCase().includes(s)
    );
  }

  const total = patients.length;
  const start = (Number(page) - 1) * Number(limit);
  const paginated = patients.slice(start, start + Number(limit));

  res.json({ success: true, count: total, page: Number(page), pages: Math.ceil(total / limit), patients: paginated });
});

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id).populate("user", "name email phone profileImage gender dateOfBirth address");
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }
  res.json({ success: true, patient });
});

// @desc    Update patient medical profile
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  const fields = ["bloodGroup", "height", "weight", "allergies", "medicalHistory", "emergencyContactName", "emergencyContactPhone"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) patient[f] = req.body[f];
  });

  await patient.save();
  res.json({ success: true, patient });
});

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private/Admin
const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }
  await User.findByIdAndDelete(patient.user);
  await patient.deleteOne();
  res.json({ success: true, message: "Patient removed" });
});

// @desc    Get patient dashboard summary (appointments, bills)
// @route   GET /api/patients/:id/summary
// @access  Private
const getPatientSummary = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.params.id })
    .populate({ path: "doctor", populate: { path: "user", select: "name profileImage" } })
    .sort({ date: -1 });

  const bills = await Bill.find({ patient: req.params.id }).sort({ createdAt: -1 });

  res.json({ success: true, appointments, bills });
});

module.exports = { getPatients, getPatientById, updatePatient, deletePatient, getPatientSummary };
