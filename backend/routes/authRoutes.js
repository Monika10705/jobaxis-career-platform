const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  requestEmailChange,
  confirmEmailChange,
  sendVerifyEmail,
  verifyEmail,
  sendRegisterOtp,
  verifyRegisterOtp,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

// Pre-registration OTP
router.post("/send-register-otp", sendRegisterOtp);
router.post("/verify-register-otp", verifyRegisterOtp);

// Image upload
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

// Forgot / Reset password (public)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Change email (protected)
router.post("/request-email-change", protect, requestEmailChange);
router.post("/confirm-email-change", protect, confirmEmailChange);

// Email verification (protected)
router.post("/send-verify-email", protect, sendVerifyEmail);
router.post("/verify-email", protect, verifyEmail);

module.exports = router;
