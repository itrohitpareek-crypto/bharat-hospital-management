const asyncHandler = require("express-async-handler");
const HospitalSettings = require("../models/HospitalSettings");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// @desc    Get hospital settings
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
  let settings = await HospitalSettings.findOne();
  if (!settings) {
    settings = await HospitalSettings.create({});
  }
  res.json({ success: true, settings });
});

// @desc    Update hospital settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
  let logoUrl;
  if (req.file) {
    logoUrl = await uploadToCloudinary(req.file.buffer, "bharat-hospital/logo");
  }

  let settings = await HospitalSettings.findOne();
  if (!settings) {
    settings = await HospitalSettings.create({
      ...req.body,
      logo: logoUrl || "",
    });
  } else {
    Object.assign(settings, req.body);
    if (logoUrl) {
      settings.logo = logoUrl;
    }
    await settings.save();
  }
  res.json({ success: true, settings });
});

module.exports = { getSettings, updateSettings };