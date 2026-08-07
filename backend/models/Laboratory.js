const mongoose = require("mongoose");

const labSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    testType: {
      type: String,
      enum: ["Blood Test", "Urine Test", "MRI", "CT Scan", "X-Ray", "Other"],
      required: true,
    },
    testName: { type: String, required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    result: { type: String, default: "" },
    resultFile: { type: String, default: "" },
    price: { type: Number, default: 0 },
    scheduledDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Laboratory", labSchema);
