const asyncHandler = require("express-async-handler");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");
const { appointmentBookedEmail, appointmentStatusEmail } = require("../utils/emailTemplates");

// @desc    Get appointments (role-aware)
// @route   GET /api/appointments
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = {};

  if (req.user.role === "patient") {
    const patient = await Patient.findOne({ user: req.user._id });
    if (patient) query.patient = patient._id;
  } else if (req.user.role === "doctor") {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (doctor) query.doctor = doctor._id;
  }

  if (status) query.status = status;

  const appointments = await Appointment.find(query)
    .populate({ path: "patient", populate: { path: "user", select: "name email phone profileImage" } })
    .populate({ path: "doctor", populate: { path: "user", select: "name email profileImage" } })
    .sort({ date: -1 });

  const total = appointments.length;
  const start = (Number(page) - 1) * Number(limit);
  const paginated = appointments.slice(start, start + Number(limit));

  res.json({ success: true, count: total, page: Number(page), pages: Math.ceil(total / limit), appointments: paginated });
});

// @desc    Book new appointment
// @route   POST /api/appointments
// @access  Private/Patient
const createAppointment = asyncHandler(async (req, res) => {
  const { doctor, date, time, reason } = req.body;

  let patientId = req.body.patient;
  if (req.user.role === "patient") {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      res.status(404);
      throw new Error("Patient profile not found");
    }
    patientId = patient._id;
  }

  const doctorDoc = await Doctor.findById(doctor);
  if (!doctorDoc) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  // Validate the doctor is available on this day of the week
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const bookingDate = new Date(date);
  const dayName = dayNames[bookingDate.getDay()];
  if (doctorDoc.availableDays?.length && !doctorDoc.availableDays.includes(dayName)) {
    res.status(400);
    throw new Error(`This doctor is not available on ${dayName}s. Available days: ${doctorDoc.availableDays.join(", ")}`);
  }

  // Validate the time falls within the doctor's working hours
  if (doctorDoc.availableTimeStart && doctorDoc.availableTimeEnd) {
    if (time < doctorDoc.availableTimeStart || time >= doctorDoc.availableTimeEnd) {
      res.status(400);
      throw new Error(`Please choose a time between ${doctorDoc.availableTimeStart} and ${doctorDoc.availableTimeEnd}`);
    }
  }

  // Prevent double-booking: same doctor, same date, same time, still active
  const dayStart = new Date(bookingDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(bookingDate);
  dayEnd.setHours(23, 59, 59, 999);

  const clash = await Appointment.findOne({
    doctor,
    time,
    date: { $gte: dayStart, $lte: dayEnd },
    status: { $in: ["pending", "approved"] },
  });
  if (clash) {
    res.status(400);
    throw new Error("This time slot is already booked for this doctor. Please choose a different time.");
  }

  const appointment = await Appointment.create({
    patient: patientId,
    doctor,
    date,
    time,
    reason,
    fee: doctorDoc.fee,
  });

  res.status(201).json({ success: true, appointment });

  const patientDoc = await Patient.findById(patientId).populate("user", "name email");
  const doctorForEmail = await Doctor.findById(doctor).populate("user", "name");
  if (patientDoc?.user?.email) {
    sendEmail({
      to: patientDoc.user.email,
      subject: "Appointment Request Received — Bharat Hospital",
      html: appointmentBookedEmail({
        patientName: patientDoc.user.name,
        doctorName: doctorForEmail?.user?.name || "your doctor",
        date: new Date(date).toLocaleDateString(),
        time,
        reason,
      }),
    });
  }

  if (doctorForEmail?.user?._id) {
    Notification.create({
      user: doctorForEmail.user._id,
      title: "New Appointment Request",
      message: `${patientDoc?.user?.name || "A patient"} requested an appointment on ${new Date(date).toLocaleDateString()} at ${time}.`,
      type: "info",
      link: "/doctor/appointments",
    }).catch((err) => console.error("Notification create failed:", err.message));
  }
});

// @desc    Update appointment status / details
// @route   PUT /api/appointments/:id
// @access  Private/Doctor/Admin
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  const statusChanged = req.body.status && req.body.status !== appointment.status;

  const fields = ["status", "date", "time", "reason", "notes", "prescription"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) appointment[f] = req.body[f];
  });

  await appointment.save();
  res.json({ success: true, appointment });

  if (statusChanged) {
    const patientDoc = await Patient.findById(appointment.patient).populate("user", "name email");
    const doctorDoc = await Doctor.findById(appointment.doctor).populate("user", "name");
    if (patientDoc?.user?.email) {
      sendEmail({
        to: patientDoc.user.email,
        subject: `Appointment Update — Bharat Hospital`,
        html: appointmentStatusEmail({
          patientName: patientDoc.user.name,
          doctorName: doctorDoc?.user?.name || "your doctor",
          date: new Date(appointment.date).toLocaleDateString(),
          time: appointment.time,
          status: appointment.status,
        }),
      });
    }

    if (patientDoc?.user?._id) {
      const statusLabels = { approved: "confirmed", rejected: "declined", completed: "marked complete", cancelled: "cancelled" };
      Notification.create({
        user: patientDoc.user._id,
        title: "Appointment Update",
        message: `Your appointment with ${doctorDoc?.user?.name || "the doctor"} on ${new Date(appointment.date).toLocaleDateString()} was ${statusLabels[appointment.status] || appointment.status}.`,
        type: appointment.status === "approved" || appointment.status === "completed" ? "success" : appointment.status === "rejected" || appointment.status === "cancelled" ? "error" : "info",
        link: "/patient/appointments",
      }).catch((err) => console.error("Notification create failed:", err.message));
    }
  }
});

// @desc    Cancel/Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }
  await appointment.deleteOne();
  res.json({ success: true, message: "Appointment removed" });
});

module.exports = { getAppointments, createAppointment, updateAppointment, deleteAppointment };