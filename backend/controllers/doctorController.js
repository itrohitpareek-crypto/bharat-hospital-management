const asyncHandler = require("express-async-handler");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

// @desc    Get all doctors (with search & filter)
// @route   GET /api/doctors
// @access  Public
const getDoctors = asyncHandler(async (req, res) => {
  const { search, department, page = 1, limit = 10 } = req.query;

  const query = {};
  if (department) query.department = department;

  let doctors = await Doctor.find(query)
    .populate("user", "name email phone profileImage isActive")
    .sort({ createdAt: -1 });

  if (search) {
    const s = search.toLowerCase();
    doctors = doctors.filter(
      (d) =>
        d.user?.name?.toLowerCase().includes(s) ||
        d.specialization?.toLowerCase().includes(s) ||
        d.department?.toLowerCase().includes(s)
    );
  }

  const total = doctors.length;
  const start = (Number(page) - 1) * Number(limit);
  const paginated = doctors.slice(start, start + Number(limit));

  res.json({ success: true, count: total, page: Number(page), pages: Math.ceil(total / limit), doctors: paginated });
});

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate("user", "name email phone profileImage");
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }
  res.json({ success: true, doctor });
});

// @desc    Create doctor (admin only)
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = asyncHandler(async (req, res) => {
  const { name, email, password, specialization, department, qualification, experience, fee, availableDays, availableTimeStart, availableTimeEnd } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("A user with this email already exists");
  }

  const user = await User.create({ name, email, password, role: "doctor", phone: req.body.phone || "" });

  const doctor = await Doctor.create({
    user: user._id,
    specialization,
    department,
    qualification,
    experience,
    fee,
    availableDays: availableDays || [],
    availableTimeStart: availableTimeStart || "09:00",
    availableTimeEnd: availableTimeEnd || "17:00",
  });

  res.status(201).json({ success: true, doctor });
});

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private/Admin/Doctor(self)
const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  const fields = ["specialization", "department", "qualification", "experience", "fee", "availableDays", "availableTimeStart", "availableTimeEnd", "about", "status"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) doctor[f] = req.body[f];
  });

  await doctor.save();
  res.json({ success: true, doctor });
});

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }
  await User.findByIdAndDelete(doctor.user);
  await doctor.deleteOne();
  res.json({ success: true, message: "Doctor removed" });
});

// @desc    Get doctor's own appointments
// @route   GET /api/doctors/:id/appointments
// @access  Private/Doctor/Admin
const getDoctorAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ doctor: req.params.id })
    .populate({ path: "patient", populate: { path: "user", select: "name email phone profileImage" } })
    .sort({ date: -1 });
  res.json({ success: true, appointments });
});

// @desc    Get available booking time slots for a doctor on a given date
// @route   GET /api/doctors/:id/slots?date=YYYY-MM-DD
// @access  Public
const getDoctorSlots = asyncHandler(async (req, res) => {
  const { date } = req.query;
  if (!date) {
    res.status(400);
    throw new Error("A date is required, e.g. ?date=2026-08-10");
  }

  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const targetDate = new Date(date);
  const dayName = dayNames[targetDate.getDay()];

  // If the doctor has specific working days set and today isn't one of them, no slots at all
  if (doctor.availableDays?.length && !doctor.availableDays.includes(dayName)) {
    return res.json({ success: true, day: dayName, available: false, slots: [] });
  }

  // Build 30-minute slots between the doctor's start and end time
  const start = doctor.availableTimeStart || "09:00";
  const end = doctor.availableTimeEnd || "17:00";
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  const slots = [];
  let cursor = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  while (cursor < endMinutes) {
    const h = Math.floor(cursor / 60);
    const m = cursor % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    cursor += 30;
  }

  // Remove slots that are already booked (pending or approved) for this doctor+date
  const dayStart = new Date(targetDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(targetDate);
  dayEnd.setHours(23, 59, 59, 999);

  const bookedAppointments = await Appointment.find({
    doctor: req.params.id,
    date: { $gte: dayStart, $lte: dayEnd },
    status: { $in: ["pending", "approved"] },
  }).select("time");

  const bookedTimes = new Set(bookedAppointments.map((a) => a.time));
  const availableSlots = slots.filter((s) => !bookedTimes.has(s));

  res.json({ success: true, day: dayName, available: true, slots: availableSlots });
});

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorAppointments,
  getDoctorSlots,
};