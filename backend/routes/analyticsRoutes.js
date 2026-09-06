const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getRecruiterAnalytics,
} = require("../controllers/analyticsController");

router.get(
  "/recruiter",
  protect,
  getRecruiterAnalytics
);

module.exports = router;