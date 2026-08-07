const mongoose = require("mongoose");

const billItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { _id: false }
);

const billSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    items: [billItemSchema],
    subTotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    status: { type: String, enum: ["paid", "unpaid", "pending"], default: "pending" },
    paymentMethod: { type: String, enum: ["cash", "card", "upi", "insurance", "razorpay", ""], default: "" },
    paidAt: { type: Date },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);