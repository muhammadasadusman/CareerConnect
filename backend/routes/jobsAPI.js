const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createJob,
  getJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

// ==========================
// Public - Get All Jobs
// ==========================
router.get("/", getJobs);

// ==========================
// Recruiter - Get Own Jobs
// ==========================
router.get(
  "/my-jobs",
  protect,
  authorizeRoles("recruiter"),
  getMyJobs
);

// ==========================
// Recruiter - Create Job
// ==========================
router.post(
  "/",
  protect,
  authorizeRoles("recruiter"),
  createJob
);

// ==========================
// Get Single Job
// ==========================
router.get("/:id", getJobById);

// ==========================
// Recruiter - Update Job
// ==========================
router.put(
  "/:id",
  protect,
  authorizeRoles("recruiter"),
  updateJob
);

// ==========================
// Recruiter - Delete Job
// ==========================
router.delete(
  "/:id",
  protect,
  authorizeRoles("recruiter"),
  deleteJob
);

module.exports = router;