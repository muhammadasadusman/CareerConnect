
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },


    // Password is optional for Google users
password: {
  type: String,
  required: false,
  validate: {
    validator: function (value) {
      return !value || value.length >= 6;
    },
    message: "Password must be at least 6 characters",
  },
  default: "",
},

// Google account ID
googleId: {
  type: String,
  default: "",
  index: true,
},

    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },

    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    resume: {
      type: String,
      default: "",
    },

    // ==========================
    // User Settings
    // ==========================

    jobAlerts: {
      type: Boolean,
      default: true,
    },

    newApplications: {
      type: Boolean,
      default: true,
    },

    interviewNotifications: {
      type: Boolean,
      default: true,
    },

    profileVisibility: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

