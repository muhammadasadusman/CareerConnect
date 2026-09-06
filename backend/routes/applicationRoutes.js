const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const uploadResume = require("../middleware/uploadMiddleware");

const {
  applyForJob,
  getMyApplications,
  getJobApplications,
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
// Candidate - My Applications
// ==========================

router.get(
  "/my-applications",
  protect,
  authorizeRoles("candidate"),
  getMyApplications
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
// Recruiter - Update Status
// ==========================

router.put(
  "/:id/status",
  protect,
  authorizeRoles("recruiter"),
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