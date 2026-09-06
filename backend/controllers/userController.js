const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// ==========================
// Get Current User Profile
// ==========================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};


// ==========================
// Update Current User Profile
// ==========================
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
      profileImage,
      bio,
      skills,
      resume,
      jobAlerts,
      profileVisibility,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Profile fields
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;
    if (resume !== undefined) user.resume = resume;

    // Settings fields
    if (jobAlerts !== undefined) {
      user.jobAlerts = jobAlerts;
    }

    if (profileVisibility !== undefined) {
      user.profileVisibility = profileVisibility;
    }

    await user.save();

    res.status(200).json({
      message: "Profile/Settings updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        profileImage: user.profileImage,
        bio: user.bio,
        skills: user.skills,
        resume: user.resume,
        jobAlerts: user.jobAlerts,
        profileVisibility: user.profileVisibility,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile/settings",
      error: error.message,
    });
  }
};


// ==========================
// Change Password
// ==========================
const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to change password",
      error: error.message,
    });
  }
};


const updateSettings = async (req, res) => {
  try {
    const {
      jobAlerts,
      newApplications,
      interviewNotifications,
      profileVisibility,
    } = req.body;

    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found in token",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (jobAlerts !== undefined) {
      user.jobAlerts = Boolean(jobAlerts);
    }

    if (newApplications !== undefined) {
      user.newApplications = Boolean(newApplications);
    }

    if (interviewNotifications !== undefined) {
      user.interviewNotifications =
        Boolean(interviewNotifications);
    }

    if (profileVisibility !== undefined) {
      user.profileVisibility =
        Boolean(profileVisibility);
    }

    await user.save();

    return res.status(200).json({
      message: "Settings saved successfully",
      settings: {
        jobAlerts: user.jobAlerts,
        newApplications: user.newApplications,
        interviewNotifications:
          user.interviewNotifications,
        profileVisibility:
          user.profileVisibility,
      },
    });

  } catch (error) {
    console.error(
      "Update Settings Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to save settings",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  updateSettings,
};