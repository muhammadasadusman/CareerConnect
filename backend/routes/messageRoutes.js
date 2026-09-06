const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const protect = require("../middleware/authMiddleware");

const {
  sendMessage,
  getConversation,
  getMyConversations,
  getUnreadCount,
  markConversationRead,
} = require("../controllers/messageController");

// ==========================
// Upload Folder
// ==========================

const uploadPath = path.join(
  __dirname,
  "../uploads/messages"
);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

// ==========================
// Multer Storage
// ==========================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// ==========================
// File Filter
// ==========================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, DOC, DOCX, JPG and PNG files are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ==========================
// Routes
// ==========================

// Get all conversations
router.get(
  "/",
  protect,
  getMyConversations
);

// Get unread count
router.get(
  "/unread",
  protect,
  getUnreadCount
);

// Get conversation with user
router.get(
  "/conversation/:userId",
  protect,
  getConversation
);

// Mark conversation as read
router.put(
  "/read/:userId",
  protect,
  markConversationRead
);

// Send message + optional attachment
router.post(
  "/",
  protect,
  upload.single("attachment"),
  sendMessage
);

module.exports = router;