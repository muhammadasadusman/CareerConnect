const User = require("../models/userModel");
const Job = require("../models/Job");
const Company = require("../models/Company");
const Application = require("../models/Application");

// ===============================
// GET ADMIN DASHBOARD STATS
// ===============================
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const candidates = await User.countDocuments({
      role: "candidate",
    });

    const recruiters = await User.countDocuments({
      role: "recruiter",
    });

    const totalJobs = await Job.countDocuments();

    const activeJobs = await Job.countDocuments({
      status: "Active",
    });

    const totalCompanies = await Company.countDocuments();

    const totalApplications = await Application.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        candidates,
        recruiters,
        totalJobs,
        activeJobs,
        totalCompanies,
        totalApplications,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};


// ===============================
// GET ALL USERS
// ===============================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};


// ===============================
// DELETE USER
// ===============================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting himself
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};


// ===============================
// DELETE JOB
// ===============================
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: error.message,
    });
  }
};


// ===============================
// DELETE COMPANY
// ===============================
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    await Company.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error("Delete Company Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete company",
      error: error.message,
    });
  }
};


// ===============================
// EXPORT
// ===============================
module.exports = {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  deleteJob,
  deleteCompany,
};