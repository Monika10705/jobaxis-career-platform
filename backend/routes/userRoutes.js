const express = require("express");
const {
    updateProfile,
    deleteResume,
    getPublicProfile,
} = require('../controllers/userControllers');
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

//Protected routes
router.put("/profile", protect, updateProfile);
router.delete("/resume", protect, deleteResume);

// Public route
router.get("/:id", getPublicProfile);

module.exports = router;
