const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const { welcomeEmail } = require("../utils/emailTemplates");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user (patient by default, admin can create doctor/admin)
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, specialization, department } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email and password");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  // Public registration is only allowed for patients; admin/doctor accounts
  // should be created by an admin via the admin panel.
  const finalRole = role === "doctor" || role === "admin" ? role : "patient";

  const user = await User.create({
    name,
    email,
    password,
    role: finalRole,
    phone: phone || "",
  });

  if (user) {
    if (finalRole === "patient") {
      await Patient.create({ user: user._id });
    } else if (finalRole === "doctor") {
      await Doctor.create({
        user: user._id,
        specialization: specialization || "General Physician",
        department: department || "General",
      });
    }

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
      token: generateToken(user._id, user.role),
    });

    sendEmail({ to: user.email, subject: "Welcome to Bharat Hospital", html: welcomeEmail(user.name) });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Your account has been deactivated. Please contact admin.");
  }

  if (role && user.role !== role) {
    res.status(401);
    throw new Error(`No ${role} account found with these credentials`);
  }

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    },
    token: generateToken(user._id, user.role),
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

// @desc    Update password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: "Password updated successfully" });
});

// @desc    Login or register via Google Sign-In (ID token from frontend)
// @route   POST /api/auth/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(400);
    throw new Error("Google token is required");
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    res.status(401);
    throw new Error("Invalid Google token");
  }

  const { sub: googleId, email, name, picture } = payload;

  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    // Existing account (maybe created via normal signup) — link Google to it
    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = "google";
      if (!user.profileImage && picture) user.profileImage = picture;
      await user.save();
    }
  } else {
    // Brand new account — created as a patient by default
    user = await User.create({
      name,
      email,
      googleId,
      authProvider: "google",
      role: "patient",
      profileImage: picture || "",
      password: crypto.randomBytes(32).toString("hex"), // unusable random password, login is via Google only
    });
    await Patient.create({ user: user._id });
    sendEmail({ to: user.email, subject: "Welcome to Bharat Hospital", html: welcomeEmail(user.name) });
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Your account has been deactivated. Please contact admin.");
  }

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    },
    token: generateToken(user._id, user.role),
  });
});

module.exports = { registerUser, loginUser, getMe, changePassword, googleAuth };
