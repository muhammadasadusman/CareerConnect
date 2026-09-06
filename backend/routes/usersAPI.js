const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
  updateSettings,
} = require("../controllers/userController");

// ==========================
// Profile Images Upload Setup
// ==========================

const uploadDir = path.join(
  __dirname,
  "../uploads/profiles"
);

// Make sure folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const filename = `profile-${req.user.id}-${Date.now()}${ext}`;

    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP and GIF images are allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// ==========================
// Get Profile
// ==========================

router.get(
  "/profile",
  protect,
  getProfile
);

// ==========================
// Update Profile
// ==========================

router.put(
  "/profile",
  protect,
  updateProfile
);

// ==========================
// Upload Profile Image
// ==========================

router.put(
  "/profile/image",
  protect,
  upload.single("profileImage"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please select an image",
        });
      }

      const profileImage = `/uploads/profiles/${req.file.filename}`;

      // Reuse existing updateProfile controller
      req.body.profileImage = profileImage;

      return updateProfile(req, res);
    } catch (error) {
      console.error(
        "Profile Image Upload Error:",
        error
      );

      return res.status(500).json({
        message: "Failed to upload profile image",
        error: error.message,
      });
    }
  }
);

// ==========================
// Change Password
// ==========================

router.put(
  "/change-password",
  protect,
  changePassword
);

// ==========================
// Update Settings
// ==========================

router.put(
  "/settings",
  protect,
  updateSettings
);

module.exports = router;