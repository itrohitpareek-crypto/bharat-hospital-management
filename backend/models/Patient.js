const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    bloodGroup: { type: String, default: "" },
    height: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    allergies: { type: String, default: "" },
    medicalHistory: { type: String, default: "" },
    emergencyContactName: { type: String, default: "" },
    emergencyContactPhone: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
