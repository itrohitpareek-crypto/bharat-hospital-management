const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    hospitalName: { type: String, default: "Bharat Hospital" },
    logo: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    theme: { type: String, default: "light" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HospitalSettings", settingsSchema);
