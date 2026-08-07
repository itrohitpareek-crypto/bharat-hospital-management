const asyncHandler = require("express-async-handler");
const Department = require("../models/Department");

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().sort({ name: 1 });
  res.json({ success: true, departments });
});

// @desc    Create department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = asyncHandler(async (req, res) => {
  const department = await Department.create(req.body);
  res.status(201).json({ success: true, department });
});

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }
  res.json({ success: true, department });
});

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);
  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }
  await department.deleteOne();
  res.json({ success: true, message: "Department removed" });
});

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment };
