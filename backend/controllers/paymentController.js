const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Bill = require("../models/Bill");
const Patient = require("../models/Patient");

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @desc    Create a Razorpay order for a bill
// @route   POST /api/payments/create-order
// @access  Private/Patient
const createOrder = asyncHandler(async (req, res) => {
  const { billId } = req.body;

  const instance = getRazorpayInstance();
  if (!instance) {
    res.status(500);
    throw new Error("Payment gateway is not configured. Please contact the hospital.");
  }

  const bill = await Bill.findById(billId);
  if (!bill) {
    res.status(404);
    throw new Error("Bill not found");
  }
  if (bill.status === "paid") {
    res.status(400);
    throw new Error("This bill is already paid");
  }

  // Ownership check — a patient can only pay their own bills
  if (req.user.role === "patient") {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient || String(bill.patient) !== String(patient._id)) {
      res.status(403);
      throw new Error("Not authorized to pay this bill");
    }
  }

  // Razorpay expects amount in paise (smallest currency unit)
  const amountInPaise = Math.round(bill.grandTotal * 100);

  let order;
  try {
    order = await instance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: bill.invoiceNumber,
      notes: { billId: String(bill._id) },
    });
  } catch (razorpayErr) {
    // Razorpay's SDK throws a custom error shape ({ statusCode, error: { description } })
    // instead of a plain Error, so we extract a readable message from it here.
    console.error("Razorpay order creation failed:", JSON.stringify(razorpayErr, null, 2));
    const description =
      razorpayErr?.error?.description ||
      razorpayErr?.error?.reason ||
      razorpayErr?.message ||
      "Unknown Razorpay error";
    res.status(500);
    throw new Error(`Payment gateway error: ${description}`);
  }

  bill.razorpayOrderId = order.id;
  await bill.save();

  res.json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    invoiceNumber: bill.invoiceNumber,
  });
});

// @desc    Verify Razorpay payment signature and mark bill as paid
// @route   POST /api/payments/verify
// @access  Private/Patient
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, billId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error("Missing payment verification details");
  }

  const bill = await Bill.findById(billId);
  if (!bill) {
    res.status(404);
    throw new Error("Bill not found");
  }
  if (bill.razorpayOrderId !== razorpay_order_id) {
    res.status(400);
    throw new Error("Order ID mismatch — payment could not be verified");
  }

  // Verify the signature to confirm this payment genuinely came from Razorpay
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error("Payment verification failed — signature mismatch");
  }

  bill.status = "paid";
  bill.paymentMethod = "razorpay";
  bill.razorpayPaymentId = razorpay_payment_id;
  bill.paidAt = new Date();
  await bill.save();

  res.json({ success: true, message: "Payment verified successfully", bill });
});

module.exports = { createOrder, verifyPayment };