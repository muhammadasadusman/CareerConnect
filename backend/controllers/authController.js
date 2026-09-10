
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/userModel");
const generateToken = require("../helpers/generateToken");

// Google OAuth Client
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// =======================
// Signup
// =======================
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "candidate",
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || "",
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// =======================
// Login
// =======================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Google-only account
    if (!user.password) {
      return res.status(401).json({
        message:
          "This account was created with Google. Please continue with Google.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || "",
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// =======================
// Google Login / Signup
// POST /api/auth/google
// =======================
const googleLogin = async (req, res) => {
  try {
    const { credential, role } = req.body;

    // Check credential
    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    // Check Google Client ID
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error(
        "GOOGLE_CLIENT_ID is missing from backend .env"
      );

      return res.status(500).json({
        message:
          "Google authentication is not configured on the server",
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        message: "Invalid Google credential",
      });
    }

    const {
      sub: googleId,
      email,
      name,
      picture,
      email_verified,
    } = payload;

    // Make sure email exists
    if (!email) {
      return res.status(400).json({
        message: "Google account email not available",
      });
    }

    // Make sure Google verified the email
    if (!email_verified) {
      return res.status(401).json({
        message: "Google email is not verified",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find existing user
    let user = await User.findOne({
      email: normalizedEmail,
    });

    // ==========================================
    // Existing user
    // ==========================================
    if (user) {
      // If existing account doesn't have googleId,
      // connect this Google account with it.
      if (!user.googleId) {
        user.googleId = googleId;
      }

      // Update profile image if available
      if (picture && !user.profileImage) {
        user.profileImage = picture;
      }

      // If name is empty, use Google name
      if (!user.name && name) {
        user.name = name;
      }

      await user.save();
    }

    // ==========================================
    // New Google user
    // ==========================================
    else {
      user = await User.create({
        name: name || "Google User",
        email: normalizedEmail,

        // Google users don't need a password
        password: "",

        // Role from registration or default to candidate
        role: role === "recruiter" ? "recruiter" : "candidate",

        googleId: googleId,
        profileImage: picture || "",
      });
    }

    // Generate CareerConnect JWT
    const token = generateToken(
      user._id,
      user.role
    );

    return res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || "",
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);

    return res.status(401).json({
      message:
        "Google authentication failed. Please try again.",
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  googleLogin,
};

