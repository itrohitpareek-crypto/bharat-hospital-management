const asyncHandler = require("express-async-handler");
const Medicine = require("../models/Medicine");

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Private
const getMedicines = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const query = {};
  if (search) query.name = { $regex: search, $options: "i" };

  const medicines = await Medicine.find(query).sort({ name: 1 });
  const total = medicines.length;
  const start = (Number(page) - 1) * Number(limit);
  const paginated = medicines.slice(start, start + Number(limit));

  res.json({ success: true, count: total, page: Number(page), pages: Math.ceil(total / limit), medicines: paginated });
});

// @desc    Create medicine
// @route   POST /api/medicines
// @access  Private/Admin
const createMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.create(req.body);
  res.status(201).json({ success: true, medicine });
});

// @desc    Update medicine (stock, price etc.)
// @route   PUT /api/medicines/:id
// @access  Private/Admin
const updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }
  Object.assign(medicine, req.body);
  await medicine.save();
  res.json({ success: true, medicine });
});

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
const deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }
  await medicine.deleteOne();
  res.json({ success: true, message: "Medicine removed" });
});

// @desc    Get low stock / expiry alerts
// @route   GET /api/medicines/alerts
// @access  Private/Admin
const getMedicineAlerts = asyncHandler(async (req, res) => {
  const lowStock = await Medicine.find({ $expr: { $lte: ["$stock", "$reorderLevel"] } });
  const soon = new Date();
  soon.setDate(soon.getDate() + 30);
  const expiringSoon = await Medicine.find({ expiryDate: { $lte: soon, $gte: new Date() } });

  res.json({ success: true, lowStock, expiringSoon });
});

module.exports = { getMedicines, createMedicine, updateMedicine, deleteMedicine, getMedicineAlerts };
