
const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  googleLogin,
} = require("../controllers/authController");

// =======================
// Normal Signup
// =======================
router.post("/signup", signup);

// =======================
// Normal Login
// =======================
router.post("/login", login);

// =======================
// Google Login / Signup
// =======================
router.post("/google", googleLogin);

module.exports = router;

