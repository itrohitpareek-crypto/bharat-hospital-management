const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Bill = require("../models/Bill");
const Medicine = require("../models/Medicine");

// @desc    Get admin dashboard statistics
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  const totalDoctors = await Doctor.countDocuments();
  const totalPatients = await Patient.countDocuments();
  const totalAppointments = await Appointment.countDocuments();
  const pendingAppointments = await Appointment.countDocuments({ status: "pending" });
  const emergencyCases = await Appointment.countDocuments({ reason: { $regex: "emergency", $options: "i" } });

  const bills = await Bill.find();
  const income = bills.filter((b) => b.status === "paid").reduce((sum, b) => sum + b.grandTotal, 0);
  const pendingBills = bills.filter((b) => b.status !== "paid").length;

  const lowStockMedicines = await Medicine.countDocuments({ $expr: { $lte: ["$stock", "$reorderLevel"] } });

  // Revenue chart data: last 6 months
  const now = new Date();
  const revenueByMonth = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    const monthBills = bills.filter(
      (b) => b.status === "paid" && b.paidAt && new Date(b.paidAt) >= monthStart && new Date(b.paidAt) <= monthEnd
    );
    revenueByMonth.push({
      month: monthStart.toLocaleString("default", { month: "short" }),
      revenue: monthBills.reduce((sum, b) => sum + b.grandTotal, 0),
    });
  }

  // Patients registered per month (last 6 months)
  const allPatients = await Patient.find();
  const patientsByMonth = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    const count = allPatients.filter((p) => new Date(p.createdAt) >= monthStart && new Date(p.createdAt) <= monthEnd).length;
    patientsByMonth.push({ month: monthStart.toLocaleString("default", { month: "short" }), patients: count });
  }

  const recentAppointments = await Appointment.find()
    .populate({ path: "patient", populate: { path: "user", select: "name profileImage" } })
    .populate({ path: "doctor", populate: { path: "user", select: "name profileImage" } })
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    stats: {
      totalDoctors,
      totalPatients,
      totalAppointments,
      pendingAppointments,
      emergencyCases,
      income,
      pendingBills,
      lowStockMedicines,
    },
    revenueByMonth,
    patientsByMonth,
    recentAppointments,
  });
});

// @desc    Get doctor dashboard statistics
// @route   GET /api/dashboard/doctor
// @access  Private/Doctor
const getDoctorStats = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor profile not found");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = await Appointment.find({ doctor: doctor._id, date: { $gte: today, $lt: tomorrow } })
    .populate({ path: "patient", populate: { path: "user", select: "name profileImage" } })
    .sort({ time: 1 });

  const totalAppointments = await Appointment.countDocuments({ doctor: doctor._id });
  const completedAppointments = await Appointment.countDocuments({ doctor: doctor._id, status: "completed" });
  const pendingAppointments = await Appointment.countDocuments({ doctor: doctor._id, status: "pending" });

  const uniquePatients = await Appointment.distinct("patient", { doctor: doctor._id });

  res.json({
    success: true,
    stats: {
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      totalPatients: uniquePatients.length,
    },
    todayAppointments,
  });
});

// @desc    Get patient dashboard statistics
// @route   GET /api/dashboard/patient
// @access  Private/Patient
const getPatientStats = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id });
  if (!patient) {
    res.status(404);
    throw new Error("Patient profile not found");
  }

  const upcomingAppointments = await Appointment.find({
    patient: patient._id,
    date: { $gte: new Date() },
    status: { $in: ["pending", "approved"] },
  })
    .populate({ path: "doctor", populate: { path: "user", select: "name profileImage" } })
    .sort({ date: 1 })
    .limit(5);

  const totalAppointments = await Appointment.countDocuments({ patient: patient._id });
  const bills = await Bill.find({ patient: patient._id });
  const pendingBillsAmount = bills.filter((b) => b.status !== "paid").reduce((sum, b) => sum + b.grandTotal, 0);

  res.json({
    success: true,
    stats: {
      totalAppointments,
      pendingBillsAmount,
      totalBills: bills.length,
    },
    upcomingAppointments,
  });
});

module.exports = { getAdminStats, getDoctorStats, getPatientStats };
