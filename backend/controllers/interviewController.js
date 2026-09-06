
const Interview = require("../models/interview");
const Application = require("../models/application");

// ==========================================
// Schedule Interview
// ==========================================

const scheduleInterview = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const {
      application,
      date,
      time,
      type,
      meetingLink,
      location,
      notes,
    } = req.body;

    // Required fields
    if (!application || !date || !time) {
      return res.status(400).json({
        message: "Application, date and time are required",
      });
    }

    // Find application
    const existingApplication = await Application.findById(
      application
    )
      .populate("job")
      .populate("candidate");

    if (!existingApplication) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Make sure recruiter owns the job
    if (
      existingApplication.job.postedBy.toString() !==
      recruiterId.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to schedule this interview",
      });
    }

    // Candidate should be shortlisted/interview
    if (
      !["Shortlisted", "Interview"].includes(
        existingApplication.status
      )
    ) {
      return res.status(400).json({
        message:
          "Only shortlisted candidates can be scheduled for interview",
      });
    }

    // Check existing scheduled interview
    const existingInterview = await Interview.findOne({
      application,
      status: "Scheduled",
    });

    if (existingInterview) {
      return res.status(400).json({
        message:
          "An interview is already scheduled for this application",
      });
    }

    // Create interview
    const interview = await Interview.create({
      application,
      job: existingApplication.job._id,
      recruiter: recruiterId,
      candidate: existingApplication.candidate._id,
      date,
      time,
      type: type || "Online",
      meetingLink: meetingLink || "",
      location: location || "",
      notes: notes || "",
    });

    // Update application status
    existingApplication.status = "Interview";
    await existingApplication.save();

    // Populate complete interview data
    const populatedInterview = await Interview.findById(
      interview._id
    )
      .populate(
        "candidate",
        "name email profileImage"
      )
      .populate(
        "recruiter",
        "name email profileImage"
      )
      .populate({
        path: "job",
        select: "title location jobType company",
        populate: {
          path: "company",
          select: "name logo",
        },
      })
      .populate(
        "application",
        "status"
      );

    res.status(201).json({
      message: "Interview scheduled successfully",
      interview: populatedInterview,
    });
  } catch (error) {
    console.error(
      "Schedule Interview Error:",
      error
    );

    res.status(500).json({
      message: "Failed to schedule interview",
      error: error.message,
    });
  }
};

// ==========================================
// Get Recruiter's Interviews
// ==========================================

const getRecruiterInterviews = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const interviews = await Interview.find({
      recruiter: recruiterId,
    })
      .populate(
        "candidate",
        "name email profileImage"
      )
      .populate({
        path: "job",
        select: "title location jobType company",
        populate: {
          path: "company",
          select: "name logo",
        },
      })
      .populate(
        "application",
        "status"
      )
      .sort({
        date: 1,
        createdAt: -1,
      });

    res.status(200).json({
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error(
      "Get Recruiter Interviews Error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch interviews",
      error: error.message,
    });
  }
};

// ==========================================
// Get Candidate Interviews
// ==========================================

const getCandidateInterviews = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const interviews = await Interview.find({
      candidate: candidateId,
    })
      .populate(
        "recruiter",
        "name email profileImage"
      )
      .populate({
        path: "job",
        select: "title location jobType company",
        populate: {
          path: "company",
          select: "name logo",
        },
      })
      .populate(
        "application",
        "status"
      )
      .sort({
        date: 1,
        createdAt: -1,
      });

    res.status(200).json({
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error(
      "Get Candidate Interviews Error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch candidate interviews",
      error: error.message,
    });
  }
};

// ==========================================
// Update Interview Status
// ==========================================

const updateInterviewStatus = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    if (
      ![
        "Scheduled",
        "Completed",
        "Cancelled",
      ].includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid interview status",
      });
    }

    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    if (
      interview.recruiter.toString() !==
      recruiterId.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    interview.status = status;

    await interview.save();

    const updatedInterview = await Interview.findById(id)
      .populate(
        "candidate",
        "name email profileImage"
      )
      .populate({
        path: "job",
        select: "title location jobType company",
        populate: {
          path: "company",
          select: "name logo",
        },
      })
      .populate(
        "application",
        "status"
      );

    res.status(200).json({
      message:
        "Interview status updated successfully",
      interview: updatedInterview,
    });
  } catch (error) {
    console.error(
      "Update Interview Status Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update interview status",
      error: error.message,
    });
  }
};

// ==========================================
// Delete / Cancel Interview
// ==========================================

const cancelInterview = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { id } = req.params;

    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    if (
      interview.recruiter.toString() !==
      recruiterId.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    interview.status = "Cancelled";

    await interview.save();

    res.status(200).json({
      message: "Interview cancelled successfully",
    });
  } catch (error) {
    console.error(
      "Cancel Interview Error:",
      error
    );

    res.status(500).json({
      message: "Failed to cancel interview",
      error: error.message,
    });
  }
};

// ==========================================
// Export
// ==========================================

module.exports = {
  scheduleInterview,
  getRecruiterInterviews,
  getCandidateInterviews,
  updateInterviewStatus,
  cancelInterview,
};

