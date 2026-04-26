const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendWelcomeEmail, sendOtpEmail } = require("../utils/emailService");

//generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "60d" });
};

//@desc register new user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, avatar, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Ensure email was OTP-verified before registration
    const otpRecord = preRegOtps.get(email);
    if (!otpRecord || !otpRecord.verified) {
      return res.status(400).json({ message: "Please verify your email with OTP before registering" });
    }
    preRegOtps.delete(email); // consume it

    const user = await User.create({
      name,
      email,
      password,
      role,
      avatar,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      token: generateToken(user._id),
      companyName: user.companyName || "",
      companyDescription: user.companyDescription || "",
      companyLogo: user.companyLogo || "",
      resume: user.resume || "",
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//@desc login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id),
      companyName: user.companyName || "",
      companyDescription: user.companyDescription || "",
      companyLogo: user.companyLogo || "",
      resume: user.resume || "",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//@desc Get logged-in user
exports.getMe = async (req, res) => {
  res.json(req.user);
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const generateOtp = () => crypto.randomInt(100000, 999999).toString();

const saveOtp = async (user, purpose) => {
  const otp = generateOtp();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  user.otpPurpose = purpose;
  await user.save();
  return otp;
};

// ── Forgot Password ───────────────────────────────────────────────────────────

//@desc  Send OTP to email for password reset
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account found with that email" });

    const otp = await saveOtp(user, "reset-password");
    await sendOtpEmail(user, otp, "reset-password");

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//@desc  Verify OTP + reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email, otpPurpose: "reset-password" });

    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword; // pre-save hook will hash it
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpPurpose = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Change Email ──────────────────────────────────────────────────────────────

//@desc  Request email change — sends OTP to the NEW email
exports.requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const user = req.user;

    const taken = await User.findOne({ email: newEmail });
    if (taken) return res.status(400).json({ message: "Email already in use" });

    user.pendingEmail = newEmail;
    const otp = await saveOtp(user, "change-email");

    // Send OTP to the NEW email address
    await sendOtpEmail({ ...user.toObject(), email: newEmail }, otp, "change-email");

    res.json({ message: "OTP sent to your new email address" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//@desc  Confirm email change with OTP
exports.confirmEmailChange = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = req.user;

    if (!user.pendingEmail || user.otp !== otp || user.otpExpiry < new Date() || user.otpPurpose !== "change-email") {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpPurpose = undefined;
    await user.save();

    res.json({ message: "Email updated successfully", email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Email Verification (on signup) ───────────────────────────────────────────

//@desc  Send verification OTP to current email
exports.sendVerifyEmail = async (req, res) => {
  try {
    const user = req.user;
    if (user.isEmailVerified) return res.status(400).json({ message: "Email already verified" });

    const otp = await saveOtp(user, "verify-email");
    await sendOtpEmail(user, otp, "verify-email");

    res.json({ message: "Verification OTP sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//@desc  Verify email with OTP
exports.verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = req.user;

    if (user.otp !== otp || user.otpExpiry < new Date() || user.otpPurpose !== "verify-email") {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpPurpose = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Pre-registration Email OTP ────────────────────────────────────────────────

// Temporary in-memory store for pre-registration OTPs
// (keyed by email, cleared after use or expiry)
const preRegOtps = new Map();

//@desc  Send OTP to email before registration
exports.sendRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const otp = generateOtp();
    preRegOtps.set(email, { otp, expiry: Date.now() + 10 * 60 * 1000 });

    await sendOtpEmail({ email, name: "there" }, otp, "verify-email");

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//@desc  Verify pre-registration OTP
exports.verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = preRegOtps.get(email);

    if (!record || record.otp !== otp || Date.now() > record.expiry) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark as verified (keep in map so register can confirm it was verified)
    preRegOtps.set(email, { ...record, verified: true });

    res.json({ message: "Email verified" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
