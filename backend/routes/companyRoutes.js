const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createCompany,
  getCompanies,
  getMyCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");


// ==========================
// Public Routes
// ==========================

// Get all companies
router.get("/", getCompanies);


// ==========================
// Recruiter Routes
// ==========================

// Get logged-in recruiter's company
router.get(
  "/my-company",
  protect,
  authorizeRoles("recruiter"),
  getMyCompany
);


// Create company
router.post(
  "/",
  protect,
  authorizeRoles("recruiter"),
  createCompany
);


// ==========================
// Single Company
// ==========================

// Get single company
router.get("/:id", getCompanyById);


// Update company
router.put(
  "/:id",
  protect,
  authorizeRoles("recruiter"),
  updateCompany
);


// Delete company
router.delete(
  "/:id",
  protect,
  authorizeRoles("recruiter", "admin"),
  deleteCompany
);


module.exports = router;