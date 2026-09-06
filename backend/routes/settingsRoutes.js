const express = require("express");

const {
  getSettings,
  updateProfile,
  changePassword,
  updatePreferences,
} = require("../controllers/settingsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// Get Settings
// GET /api/settings
// ==========================================
router.get("/", protect, getSettings);

// ==========================================
// Update Profile
// PUT /api/settings/profile
// ==========================================
router.put(
  "/profile",
  protect,
  updateProfile
);

// ==========================================
// Change Password
// PUT /api/settings/password
// ==========================================
router.put(
  "/password",
  protect,
  changePassword
);

// ==========================================
// Update Preferences
// PUT /api/settings/preferences
// ==========================================
router.put(
  "/preferences",
  protect,
  updatePreferences
);

module.exports = router;