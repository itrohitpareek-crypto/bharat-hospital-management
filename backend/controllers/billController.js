const asyncHandler = require("express-async-handler");
const Bill = require("../models/Bill");
const Patient = require("../models/Patient");
const generateInvoiceNumber = require("../utils/generateInvoiceNumber");

// @desc    Get bills (role-aware)
// @route   GET /api/bills
// @access  Private
const getBills = asyncHandler(async (req, res) => {
  const query = {};
  if (req.user.role === "patient") {
    const patient = await Patient.findOne({ user: req.user._id });
    if (patient) query.patient = patient._id;
  }
  if (req.query.status) query.status = req.query.status;

  const bills = await Bill.find(query)
    .populate({ path: "patient", populate: { path: "user", select: "name email phone" } })
    .sort({ createdAt: -1 });

  res.json({ success: true, count: bills.length, bills });
});

// @desc    Create a bill / invoice
// @route   POST /api/bills
// @access  Private/Admin
const createBill = asyncHandler(async (req, res) => {
  const { patient, appointment, items, discount = 0, gstPercent = 5 } = req.body;

  const subTotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const gstAmount = ((subTotal - discount) * gstPercent) / 100;
  const grandTotal = subTotal - discount + gstAmount;

  const itemsWithTotal = items.map((i) => ({ ...i, total: i.quantity * i.unitPrice }));

  const bill = await Bill.create({
    invoiceNumber: generateInvoiceNumber(),
    patient,
    appointment,
    items: itemsWithTotal,
    subTotal,
    discount,
    gst: gstAmount,
    grandTotal,
  });

  res.status(201).json({ success: true, bill });
});

// @desc    Update bill (mark as paid etc.)
// @route   PUT /api/bills/:id
// @access  Private/Admin
const updateBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  if (!bill) {
    res.status(404);
    throw new Error("Bill not found");
  }

  const fields = ["status", "paymentMethod"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) bill[f] = req.body[f];
  });

  if (req.body.status === "paid" && !bill.paidAt) {
    bill.paidAt = new Date();
  }

  await bill.save();
  res.json({ success: true, bill });
});

// @desc    Delete bill
// @route   DELETE /api/bills/:id
// @access  Private/Admin
const deleteBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  if (!bill) {
    res.status(404);
    throw new Error("Bill not found");
  }
  await bill.deleteOne();
  res.json({ success: true, message: "Bill removed" });
});

module.exports = { getBills, createBill, updateBill, deleteBill };
