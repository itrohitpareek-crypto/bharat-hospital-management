const asyncHandler = require("express-async-handler");
const Laboratory = require("../models/Laboratory");
const Patient = require("../models/Patient");

// @desc    Get lab tests (role-aware)
// @route   GET /api/lab
// @access  Private
const getLabTests = asyncHandler(async (req, res) => {
  const query = {};
  if (req.user.role === "patient") {
    const patient = await Patient.findOne({ user: req.user._id });
    if (patient) query.patient = patient._id;
  }
  if (req.query.status) query.status = req.query.status;

  const tests = await Laboratory.find(query)
    .populate({ path: "patient", populate: { path: "user", select: "name email phone" } })
    .populate({ path: "requestedBy", populate: { path: "user", select: "name" } })
    .sort({ createdAt: -1 });

  res.json({ success: true, count: tests.length, tests });
});

// @desc    Create lab test request
// @route   POST /api/lab
// @access  Private/Doctor/Admin
const createLabTest = asyncHandler(async (req, res) => {
  const test = await Laboratory.create(req.body);
  res.status(201).json({ success: true, test });
});

// @desc    Update lab test (add results, change status)
// @route   PUT /api/lab/:id
// @access  Private/Admin
const updateLabTest = asyncHandler(async (req, res) => {
  const test = await Laboratory.findById(req.params.id);
  if (!test) {
    res.status(404);
    throw new Error("Lab test not found");
  }
  Object.assign(test, req.body);
  await test.save();
  res.json({ success: true, test });
});

// @desc    Delete lab test
// @route   DELETE /api/lab/:id
// @access  Private/Admin
const deleteLabTest = asyncHandler(async (req, res) => {
  const test = await Laboratory.findById(req.params.id);
  if (!test) {
    res.status(404);
    throw new Error("Lab test not found");
  }
  await test.deleteOne();
  res.json({ success: true, message: "Lab test removed" });
});

module.exports = { getLabTests, createLabTest, updateLabTest, deleteLabTest };
