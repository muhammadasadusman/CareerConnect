const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const uploadResume = require("../middleware/uploadMiddleware");

const {
  applyForJob,
  checkApplication,
  getMyApplications,
  getJobApplications,
  getRecruiterAllApplications,
  updateApplicationStatus,
  deleteApplication,
  getAllApplications,
} = require("../controllers/applicationController");

// ==========================
// Candidate - Apply for Job
// ==========================

router.post(
  "/apply",
  protect,
  authorizeRoles("candidate"),
  uploadResume.single("resume"),
  applyForJob
);

// ==========================
// Check if applied for job
// ==========================

router.get(
  "/check/:jobId",
  protect,
  checkApplication
);

// ==========================
// Candidate - My Applications
// ==========================

router.get(
  "/my-applications",
  protect,
  authorizeRoles("candidate"),
  getMyApplications
);

// ==========================
// Recruiter - All Applications
// ==========================

router.get(
  "/recruiter",
  protect,
  authorizeRoles("recruiter"),
  getRecruiterAllApplications
);

// ==========================
// Recruiter - Job Applications
// ==========================

router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("recruiter"),
  getJobApplications
);

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  getAllApplications
);

// ==========================
// Update Status (Recruiter or Admin)
// ==========================

router.put(
  "/:id/status",
  protect,
  authorizeRoles("recruiter", "admin"),
  updateApplicationStatus
);

// ==========================
// Candidate - Delete Application
// ==========================

router.delete(
  "/:id",
  protect,
  authorizeRoles("candidate"),
  deleteApplication
);

module.exports = router;