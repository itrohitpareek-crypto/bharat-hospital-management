const asyncHandler = require("express-async-handler");
const HospitalSettings = require("../models/HospitalSettings");

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
  let settings = await HospitalSettings.findOne();
  if (!settings) {
    settings = await HospitalSettings.create({
      ...req.body,
      logo: req.file ? req.file.path : "",
    });
  } else {
    Object.assign(settings, req.body);
    if (req.file) {
      settings.logo = req.file.path;
    }
    await settings.save();
  }
  res.json({ success: true, settings });
});

module.exports = { getSettings, updateSettings };