const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  scheduleInterview,
  getRecruiterInterviews,
  getCandidateInterviews,
  updateInterviewStatus,
  cancelInterview,
} = require("../controllers/interviewController");

// ==========================================
// Recruiter
// ==========================================

router.post(
  "/",
  protect,
  scheduleInterview
);

router.get(
  "/recruiter",
  protect,
  getRecruiterInterviews
);

// ==========================================
// Candidate
// ==========================================

router.get(
  "/candidate",
  protect,
  getCandidateInterviews
);

// ==========================================
// Update Status
// ==========================================

router.put(
  "/:id/status",
  protect,
  updateInterviewStatus
);

// ==========================================
// Cancel Interview
// ==========================================

router.put(
  "/:id/cancel",
  protect,
  cancelInterview
);

module.exports = router;