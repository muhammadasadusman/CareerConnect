const Job = require("../models/job");
const Company = require("../models/company");

// =====================================================
// Job Logo Helper
// =====================================================
const getJobLogo = (title = "", category = "") => {
  const text = `${title} ${category}`.toLowerCase();

  // ===================================================
  // React
  // ===================================================
  if (
    text.includes("react") ||
    text.includes("react.js") ||
    text.includes("react js")
  ) {
    return "/uploads/job-logos/react.jpg";
  }

  // ===================================================
  // UI/UX / Design
  // ===================================================
  if (
    text.includes("ui/ux") ||
    text.includes("ui ux") ||
    text.includes("uiux") ||
    text.includes("ux") ||
    text.includes("ui designer") ||
    text.includes("ui/ux designer") ||
    text.includes("designer") ||
    text.includes("design")
  ) {
    return "/uploads/job-logos/uiux.jpg";
  }

  // ===================================================
  // JavaScript
  // ===================================================
  if (
    text.includes("javascript") ||
    text.includes("java script") ||
    text.includes("js developer") ||
    text.includes("js developer")
  ) {
    return "/uploads/job-logos/javascript.jpg";
  }

  // ===================================================
  // Backend / Node / Express
  // ===================================================
  if (
    text.includes("backend") ||
    text.includes("back-end") ||
    text.includes("node") ||
    text.includes("node.js") ||
    text.includes("node js") ||
    text.includes("express")
  ) {
    return "/uploads/job-logos/backend.jpg";
  }

  // ===================================================
  // Full Stack / MERN / MEAN
  // ===================================================
  if (
    text.includes("full stack") ||
    text.includes("fullstack") ||
    text.includes("full-stack") ||
    text.includes("mern") ||
    text.includes("mean")
  ) {
    return "/uploads/job-logos/fullstack.jpg";
  }

  // ===================================================
  // Frontend
  // ===================================================
  if (
    text.includes("frontend") ||
    text.includes("front-end") ||
    text.includes("front end")
  ) {
    return "/uploads/job-logos/frontend.jpg";
  }

  // ===================================================
  // Product Design
  // ===================================================
  if (
    text.includes("product designer") ||
    text.includes("product design") ||
    text.includes("product")
  ) {
    return "/uploads/job-logos/product.jpg";
  }

  // ===================================================
  // Default
  // ===================================================
  return "/uploads/job-logos/frontend.jpg";
};

// =====================================================
// CREATE JOB
// POST /api/jobs
// =====================================================
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      jobType,
      category,
      salary,
      skills,
      experience,
      deadline,
    } = req.body;

    // Required fields
    if (
      !title ||
      !description ||
      !company ||
      !location ||
      !jobType ||
      !category
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Check company
    const existingCompany = await Company.findById(company);

    if (!existingCompany) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // Automatically select job logo
    const jobLogo = getJobLogo(title, category);

    const job = await Job.create({
      title,
      description,
      company,
      location,
      jobType,
      category,
      jobLogo,
      salary: salary || "",
      skills: Array.isArray(skills) ? skills : [],
      experience: experience || "",
      deadline: deadline || null,
      postedBy: req.user.id,
    });

    // Populate company + recruiter
    const populatedJob = await Job.findById(job._id)
      .populate("company", "name logo location website")
      .populate("postedBy", "name email");

    return res.status(201).json({
      message: "Job created successfully",
      job: populatedJob,
    });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    return res.status(500).json({
      message: "Failed to create job",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL JOBS
// GET /api/jobs
// =====================================================
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company", "name logo location website")
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("GET JOBS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

// =====================================================
// GET MY JOBS
// GET /api/jobs/my-jobs
// =====================================================
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user.id,
    })
      .populate("company", "name logo location website")
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("GET MY JOBS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch your jobs",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE JOB
// GET /api/jobs/:id
// =====================================================
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company", "name logo location website")
      .populate("postedBy", "name email");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    return res.status(200).json({
      job,
    });
  } catch (error) {
    console.error("GET JOB BY ID ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE JOB
// PUT /api/jobs/:id
// =====================================================
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Ownership check
    if (
      job.postedBy &&
      req.user &&
      job.postedBy.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to update this job",
      });
    }

    const {
      title,
      description,
      company,
      location,
      jobType,
      category,
      salary,
      skills,
      experience,
      deadline,
    } = req.body;

    // If company is changed, verify it
    if (company) {
      const existingCompany = await Company.findById(company);

      if (!existingCompany) {
        return res.status(404).json({
          message: "Company not found",
        });
      }

      job.company = company;
    }

    // Update fields only when provided
    if (title !== undefined) {
      job.title = title;
    }

    if (description !== undefined) {
      job.description = description;
    }

    if (location !== undefined) {
      job.location = location;
    }

    if (jobType !== undefined) {
      job.jobType = jobType;
    }

    if (category !== undefined) {
      job.category = category;
    }

    if (salary !== undefined) {
      job.salary = salary;
    }

    if (skills !== undefined) {
      job.skills = Array.isArray(skills) ? skills : [];
    }

    if (experience !== undefined) {
      job.experience = experience;
    }

    if (deadline !== undefined) {
      job.deadline = deadline || null;
    }

    // =================================================
    // IMPORTANT:
    // Always regenerate logo after title/category change
    // This also fixes old jobs when they are updated.
    // =================================================
    job.jobLogo = getJobLogo(job.title, job.category);

    await job.save();

    const updatedJob = await Job.findById(job._id)
      .populate("company", "name logo location website")
      .populate("postedBy", "name email");

    return res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);

    return res.status(500).json({
      message: "Failed to update job",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE JOB
// DELETE /api/jobs/:id
// =====================================================
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Ownership check
    if (
      job.postedBy &&
      req.user &&
      job.postedBy.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to delete this job",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete job",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================
module.exports = {
  createJob,
  getJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobLogo,
};