const Job = require("../models/job");
const Application = require("../models/application");

// ==========================================
// Get Recruiter Analytics
// ==========================================
const getRecruiterAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // ==========================================
    // Get Recruiter's Jobs
    // ==========================================

    const jobs = await Job.find({
      postedBy: recruiterId,
    }).select("_id title createdAt");

    const jobIds = jobs.map((job) => job._id);

    // ==========================================
    // Get Applications
    // ==========================================

    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("job", "title")
      .populate("candidate", "name email")
      .sort({ createdAt: -1 });

    // ==========================================
    // Stats
    // ==========================================

    const totalJobs = jobs.length;

    const totalApplications =
      applications.length;

    const applied = applications.filter(
      (application) =>
        application.status === "Applied"
    ).length;

    const reviewed = applications.filter(
      (application) =>
        application.status === "Reviewed"
    ).length;

    const shortlisted = applications.filter(
      (application) =>
        application.status === "Shortlisted"
    ).length;

    const interviews = applications.filter(
      (application) =>
        application.status === "Interview"
    ).length;

    const hired = applications.filter(
      (application) =>
        application.status === "Hired"
    ).length;

    const rejected = applications.filter(
      (application) =>
        application.status === "Rejected"
    ).length;

    // ==========================================
    // Applications By Job
    // ==========================================

    const applicationsByJob = jobs.map(
      (job) => {
        const count =
          applications.filter(
            (application) =>
              application.job?._id?.toString() ===
              job._id.toString()
          ).length;

        return {
          jobId: job._id,
          title: job.title,
          applications: count,
        };
      }
    );

    // ==========================================
    // Applications By Status
    // ==========================================

    const applicationsByStatus = [
      {
        status: "Applied",
        count: applied,
      },
      {
        status: "Reviewed",
        count: reviewed,
      },
      {
        status: "Shortlisted",
        count: shortlisted,
      },
      {
        status: "Interview",
        count: interviews,
      },
      {
        status: "Hired",
        count: hired,
      },
      {
        status: "Rejected",
        count: rejected,
      },
    ];

    // ==========================================
    // Monthly Applications - Last 6 Months
    // ==========================================

    const monthlyApplications = [];

    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const startDate = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const endDate = new Date(
        now.getFullYear(),
        now.getMonth() - i + 1,
        1
      );

      const count =
        applications.filter(
          (application) => {
            const createdAt = new Date(
              application.createdAt
            );

            return (
              createdAt >= startDate &&
              createdAt < endDate
            );
          }
        ).length;

      monthlyApplications.push({
        month: startDate.toLocaleString(
          "en-US",
          {
            month: "short",
          }
        ),
        year: startDate.getFullYear(),
        applications: count,
      });
    }

    // ==========================================
    // Recent Applications
    // ==========================================

    const recentApplications =
      applications.slice(0, 10);

    // ==========================================
    // Response
    // ==========================================

    res.status(200).json({
      success: true,

      stats: {
        totalJobs,
        totalApplications,
        applied,
        reviewed,
        shortlisted,
        interviews,
        hired,
        rejected,
      },

      applicationsByJob,

      applicationsByStatus,

      monthlyApplications,

      recentApplications,
    });
  } catch (error) {
    console.error(
      "Recruiter Analytics Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getRecruiterAnalytics,
};