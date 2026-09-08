const SavedJob = require("../models/savedJobModel");
const Job = require("../models/Job");

// ==========================
// Save Job
// ==========================
const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    // Check job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Check already saved
    const existingSavedJob = await SavedJob.findOne({
      user: req.user.id,
      job: jobId,
    });

    if (existingSavedJob) {
      return res.status(400).json({
        message: "Job already saved",
      });
    }

    const savedJob = await SavedJob.create({
      user: req.user.id,
      job: jobId,
    });

    res.status(201).json({
      message: "Job saved successfully",
      savedJob,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to save job",
      error: error.message,
    });
  }
};


// ==========================
// Get My Saved Jobs
// ==========================
const getMySavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({
      user: req.user.id,
    })
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name logo location",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: savedJobs.length,
      savedJobs,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch saved jobs",
      error: error.message,
    });
  }
};


// ==========================
// Remove Saved Job
// ==========================
const removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const savedJob = await SavedJob.findOneAndDelete({
      user: req.user.id,
      job: jobId,
    });

    if (!savedJob) {
      return res.status(404).json({
        message: "Saved job not found",
      });
    }

    res.status(200).json({
      message: "Job removed from saved jobs",
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to remove saved job",
      error: error.message,
    });
  }
};


// ==========================
// Check If Job Is Saved
// ==========================
const checkSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const savedJob = await SavedJob.findOne({
      user: req.user.id,
      job: jobId,
    });

    res.status(200).json({
      saved: !!savedJob,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to check saved job",
      error: error.message,
    });
  }
};


module.exports = {
  saveJob,
  getMySavedJobs,
  removeSavedJob,
  checkSavedJob,
};