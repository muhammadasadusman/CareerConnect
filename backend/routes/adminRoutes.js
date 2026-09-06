const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  deleteJob,
  deleteCompany,
} = require("../controllers/adminController");

// All Admin routes require authentication + admin role
router.use(protect);
router.use(authorizeRoles("admin"));

// Dashboard statistics
router.get("/dashboard", getDashboardStats);

// Get all users
router.get("/users", getAllUsers);

// Delete user
router.delete("/users/:id", deleteUser);

// Delete job
router.delete("/jobs/:id", deleteJob);

// Delete company
router.delete("/companies/:id", deleteCompany);

module.exports = router;