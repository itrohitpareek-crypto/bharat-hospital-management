const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    specialization: { type: String, required: true },
    department: { type: String, required: true },
    qualification: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    fee: { type: Number, default: 0 },
    availableDays: [{ type: String }],
    availableTimeStart: { type: String, default: "09:00" },
    availableTimeEnd: { type: String, default: "17:00" },
    about: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
