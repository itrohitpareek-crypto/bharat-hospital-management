const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: "General" },
    manufacturer: { type: String, default: "" },
    price: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    unit: { type: String, default: "tablet" },
    expiryDate: { type: Date },
    batchNumber: { type: String, default: "" },
    reorderLevel: { type: Number, default: 10 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);
