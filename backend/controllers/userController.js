const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const fields = ["name", "phone", "address", "gender", "dateOfBirth"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) user[f] = req.body[f];
  });

  if (req.file) {
    user.profileImage = req.file.path;
  }

  await user.save();
  res.json({ success: true, user });
});

// @desc    Get all users (admin - user management)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 10 } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(query).sort({ createdAt: -1 });
  const total = users.length;
  const start = (Number(page) - 1) * Number(limit);
  const paginated = users.slice(start, start + Number(limit));

  res.json({ success: true, count: total, page: Number(page), pages: Math.ceil(total / limit), users: paginated });
});

// @desc    Toggle user active status
// @route   PUT /api/users/:id/toggle-status
// @access  Private/Admin
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, user });
});

module.exports = { updateProfile, getUsers, toggleUserStatus };