const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// ==========================================
// Get Settings
// ==========================================
const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Settings fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,

        notifications: {
          jobAlerts: user.jobAlerts,
          newApplications:
            user.newApplications ?? true,
          interviewNotifications:
            user.interviewNotifications ?? true,
        },

        privacy: {
          profileVisibility:
            user.profileVisibility,
        },
      },
    });
  } catch (error) {
    console.error("Get Settings Error:", error);

    res.status(500).json({
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
};

// ==========================================
// Update Profile
// ==========================================
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      email,
      phone,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    // Check if email belongs to another user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already in use",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || "",
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// ==========================================
// Change Password
// ==========================================
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // Check fields
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All password fields are required",
      });
    }

    // Check new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters",
      });
    }

    // Check confirmation
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match",
      });
    }

    // Get user including password
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Compare current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    res.status(500).json({
      message: "Failed to change password",
      error: error.message,
    });
  }
};

// ==========================================
// Update Preferences
// ==========================================
const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      notifications,
      privacy,
    } = req.body;

    const updateData = {};

    // Notifications
    if (notifications) {
      if (
        typeof notifications.jobAlerts ===
        "boolean"
      ) {
        updateData.jobAlerts =
          notifications.jobAlerts;
      }

      if (
        typeof notifications.newApplications ===
        "boolean"
      ) {
        updateData.newApplications =
          notifications.newApplications;
      }

      if (
        typeof notifications.interviewNotifications ===
        "boolean"
      ) {
        updateData.interviewNotifications =
          notifications.interviewNotifications;
      }
    }

    // Privacy
    if (privacy) {
      if (
        typeof privacy.profileVisibility ===
        "boolean"
      ) {
        updateData.profileVisibility =
          privacy.profileVisibility;
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Preferences updated successfully",
      user,
    });
  } catch (error) {
    console.error(
      "Update Preferences Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update preferences",
      error: error.message,
    });
  }
};

module.exports = {
  getSettings,
  updateProfile,
  changePassword,
  updatePreferences,
};