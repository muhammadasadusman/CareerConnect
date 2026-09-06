const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  saveJob,
  getMySavedJobs,
  removeSavedJob,
  checkSavedJob,
} = require("../controllers/savedJobController");


// ==========================
// Save Job
// ==========================
router.post(
  "/",
  protect,
  authorizeRoles("candidate"),
  saveJob
);


// ==========================
// Get My Saved Jobs
// ==========================
router.get(
  "/my",
  protect,
  authorizeRoles("candidate"),
  getMySavedJobs
);


// ==========================
// Check Saved Job
// ==========================
router.get(
  "/check/:jobId",
  protect,
  authorizeRoles("candidate"),
  checkSavedJob
);


// ==========================
// Remove Saved Job
// ==========================
router.delete(
  "/:jobId",
  protect,
  authorizeRoles("candidate"),
  removeSavedJob
);


module.exports = router;