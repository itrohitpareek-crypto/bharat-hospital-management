const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    notes: { type: String, default: "" },
    prescription: { type: String, default: "" },
    fee: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
