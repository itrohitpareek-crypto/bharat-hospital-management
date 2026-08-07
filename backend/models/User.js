const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: function () { return !this.googleId; }, minlength: 6, select: false },
    role: { type: String, enum: ["admin", "doctor", "patient"], default: "patient" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
    dateOfBirth: { type: Date },
    profileImage: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    googleId: { type: String, default: null },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
