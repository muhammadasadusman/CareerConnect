const Application = require("../models/Application");
const Job = require("../models/Job");

// =====================================================
// Apply For Job
// POST /api/applications/apply
// =====================================================
const applyForJob = async (req, res) => {
  try {
    const { job, coverLetter } = req.body;

    const resume = req.file
      ? `/uploads/resumes/${req.file.filename}`
      : "";

    // Check Job ID
    if (!job) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    // Check if job exists
    const existingJob = await Job.findById(job);

    if (!existingJob) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Check duplicate application
    const existingApplication = await Application.findOne({
      job,
      candidate: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    // Create application
    const application = await Application.create({
      job,
      candidate: req.user.id,
      resume: resume || "",
      coverLetter: coverLetter || "",
      status: "Applied",
    });

    // Populate application
    const populatedApplication = await Application.findById(
      application._id
    )
      .populate({
        path: "job",
        select:
          "title description location jobType category jobLogo salary skills experience deadline createdAt company postedBy",
        populate: [
          {
            path: "company",
            select: "name logo location website",
          },
          {
            path: "postedBy",
            select: "name email profileImage role",
          },
        ],
      })
      .populate(
        "candidate",
        "name email phone location resume profileImage"
      );

    return res.status(201).json({
      message: "Job application submitted successfully",
      application: populatedApplication,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);

    return res.status(500).json({
      message: "Failed to apply for job",
      error: error.message,
    });
  }
};

// =====================================================
// Check Application
// GET /api/applications/check/:jobId
// =====================================================
const checkApplication = async (req, res) => {
  try {
    const { jobId } = req.params;

    const application = await Application.findOne({
      job: jobId,
      candidate: req.user.id,
    });

    return res.status(200).json({
      applied: !!application,
      application: application || null,
    });
  } catch (error) {
    console.error("Check Application Error:", error);

    return res.status(500).json({
      message: "Failed to check application",
      error: error.message,
    });
  }
};

// =====================================================
// Get Candidate Applications
// GET /api/applications/my-applications
// =====================================================
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user.id,
    })
      .populate({
        path: "job",
        select:
          "title description location jobType category jobLogo salary skills experience deadline createdAt company postedBy",
        populate: [
          {
            path: "company",
            select: "name logo location website",
          },
          {
            path: "postedBy",
            select: "name email profileImage role",
          },
        ],
      })
      .populate(
        "candidate",
        "name email phone location resume profileImage"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get My Applications Error:", error);

    return res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

// =====================================================
// Get Applications For Recruiter
// GET /api/applications/job/:jobId
// =====================================================
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Check job owner
    if (
      !job.postedBy ||
      job.postedBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only view applications for your own jobs",
      });
    }

    // Get applications
    const applications = await Application.find({
      job: jobId,
    })
      .populate(
        "candidate",
        "name email phone location resume profileImage"
      )
      .populate({
        path: "job",
        select:
          "title description location jobType category jobLogo salary skills experience deadline company postedBy",
        populate: [
          {
            path: "company",
            select: "name logo location website",
          },
          {
            path: "postedBy",
            select: "name email profileImage role",
          },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get Job Applications Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch job applications",
      error: error.message,
    });
  }
};

// =====================================================
// Update Application Status
// PUT /api/applications/:id/status
// =====================================================
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Reviewed",
      "Shortlisted",
      "Interview",
      "Hired",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    // Find application and job owner
    const application = await Application.findById(
      req.params.id
    ).populate("job", "postedBy");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Check recruiter owns job (admin can update any application)
    if (
      req.user.role !== "admin" &&
      (!application.job ||
        !application.job.postedBy ||
        application.job.postedBy.toString() !== req.user.id)
    ) {
      return res.status(403).json({
        message:
          "You can only update applications for your own jobs",
      });
    }

    // Update status
    application.status = status;

    await application.save();

    // Get updated application
    const updatedApplication =
      await Application.findById(application._id)
        .populate({
          path: "job",
          select:
            "title description location jobType category jobLogo salary skills experience deadline company postedBy createdAt",
          populate: [
            {
              path: "company",
              select: "name logo location website",
            },
            {
              path: "postedBy",
              select: "name email profileImage role",
            },
          ],
        })
        .populate(
          "candidate",
          "name email phone location resume profileImage"
        );

    return res.status(200).json({
      message:
        "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error(
      "Update Application Status Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to update application status",
      error: error.message,
    });
  }
};

// =====================================================
// Delete Application
// DELETE /api/applications/:id
// =====================================================
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Only candidate who applied can delete
    if (
      !application.candidate ||
      application.candidate.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own application",
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Application Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to delete application",
    });
  }
};

// =====================================================
// Admin - Get All Applications
// GET /api/applications/admin
// =====================================================
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({})
      .populate({
        path: "candidate",
        select:
          "name email phone location resume profileImage",
      })
      .populate({
        path: "job",
        select:
          "title description location jobType category jobLogo salary skills experience deadline createdAt company postedBy",
        populate: [
          {
            path: "company",
            select: "name logo location website",
          },
          {
            path: "postedBy",
            select: "name email profileImage role",
          },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get All Applications Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch all applications",
      error: error.message,
    });
  }
};

// =====================================================
// Get All Applications For Logged-in Recruiter
// GET /api/applications/recruiter
// =====================================================
const getRecruiterAllApplications = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // Find all jobs posted by recruiter
    const recruiterJobs = await Job.find({ postedBy: recruiterId }).select("_id");
    const jobIds = recruiterJobs.map((j) => j._id);

    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate({
        path: "job",
        select:
          "title description location jobType category jobLogo salary skills experience deadline createdAt company postedBy",
        populate: [
          {
            path: "company",
            select: "name logo location website",
          },
          {
            path: "postedBy",
            select: "name email profileImage role",
          },
        ],
      })
      .populate(
        "candidate",
        "name email phone location resume profileImage"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get Recruiter All Applications Error:", error);

    return res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

// =====================================================
// Export
// =====================================================
module.exports = {
  applyForJob,
  checkApplication,
  getMyApplications,
  getJobApplications,
  getRecruiterAllApplications,
  updateApplicationStatus,
  deleteApplication,
  getAllApplications,
};