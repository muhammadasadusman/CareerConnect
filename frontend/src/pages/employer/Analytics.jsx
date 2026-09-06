
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaBriefcase,
  FaUsers,
  FaCalendarAlt,
  FaUserCheck,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

import API from "../../api/api";
console.log("🔥🔥🔥 NEW ANALYTICS FILE LOADED 🔥🔥🔥");

const Analytics = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Company Logo URL
  // ==========================================

  const getCompanyLogoUrl = (logo) => {
    if (!logo) return null;

    if (logo.startsWith("http")) {
      return logo;
    }

    return `http://localhost:5000${
      logo.startsWith("/") ? logo : `/${logo}`
    }`;
  };

  // ==========================================
  // Fetch Analytics Data
  // ==========================================

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);
        setError("");

        // ==========================================
        // Get Recruiter's Jobs
        // ==========================================

        const jobsResponse = await API.get("/jobs/my-jobs");

        const recruiterJobs =
          jobsResponse.data.jobs || [];

        console.log(
          "ANALYTICS JOBS:",
          recruiterJobs
        );

        recruiterJobs.forEach((job) => {
          console.log(
            "ANALYTICS COMPANY:",
            job?.company
          );

          console.log(
            "ANALYTICS LOGO:",
            job?.company?.logo
          );
        });

        setJobs(recruiterJobs);
        console.log("========== ANALYTICS DEBUG ==========");

recruiterJobs.forEach((job) => {
  console.log("JOB:", job);
  console.log("COMPANY:", job?.company);
  console.log("COMPANY NAME:", job?.company?.name);
  console.log("COMPANY LOGO:", job?.company?.logo);
});

console.log("====================================");


        // ==========================================
        // Get Applications For Every Job
        // ==========================================

        const applicationResponses =
          await Promise.all(
            recruiterJobs.map(async (job) => {
              try {
                const response = await API.get(
                  `/applications/job/${job._id}`
                );

                return (
                  response.data.applications || []
                );
              } catch (err) {
                console.error(
                  `Applications error for ${job._id}:`,
                  err.response?.data ||
                    err.message
                );

                if (
                  err.response?.status === 401
                ) {
                  localStorage.removeItem(
                    "token"
                  );

                  localStorage.removeItem(
                    "user"
                  );

                  navigate("/login", {
                    replace: true,
                  });
                }

                return [];
              }
            })
          );

        const allApplications =
          applicationResponses.flat();

        allApplications.sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );

        console.log(
          "ANALYTICS APPLICATIONS:",
          allApplications
        );

        setApplicants(allApplications);
      } catch (err) {
        console.error(
          "Analytics Error:",
          err
        );

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login", {
            replace: true,
          });

          return;
        }

        setError(
          err.response?.data?.message ||
            "Failed to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate]);

  // ==========================================
  // Stats
  // ==========================================

  const totalJobs = jobs.length;

  const totalApplicants =
    applicants.length;

  const activeJobs = jobs.length;

  const interviews =
    applicants.filter(
      (application) =>
        application.status === "Interview"
    ).length;

  const hired =
    applicants.filter(
      (application) =>
        application.status === "Hired"
    ).length;

  const shortlisted =
    applicants.filter(
      (application) =>
        application.status === "Shortlisted"
    ).length;

  const rejected =
    applicants.filter(
      (application) =>
        application.status === "Rejected"
    ).length;

  const reviewed =
    applicants.filter(
      (application) =>
        application.status === "Reviewed"
    ).length;

  const pending =
    applicants.filter(
      (application) =>
        !application.status ||
        application.status === "Applied"
    ).length;

  // ==========================================
  // Status Percentage
  // ==========================================

  const getPercentage = (value) => {
    if (!totalApplicants) return 0;

    return Math.round(
      (value / totalApplicants) * 100
    );
  };

  // ==========================================
  // Format Time
  // ==========================================

  const formatTime = (date) => {
    if (!date) return "Recently";

    const now = new Date();
    const created = new Date(date);

    const difference = Math.floor(
      (now - created) / 1000
    );

    if (difference < 60) {
      return "Just now";
    }

    if (difference < 3600) {
      const minutes = Math.floor(
        difference / 60
      );

      return `${minutes} minute${
        minutes > 1 ? "s" : ""
      } ago`;
    }

    if (difference < 86400) {
      const hours = Math.floor(
        difference / 3600
      );

      return `${hours} hour${
        hours > 1 ? "s" : ""
      } ago`;
    }

    const days = Math.floor(
      difference / 86400
    );

    return `${days} day${
      days > 1 ? "s" : ""
    } ago`;
  };

  // ==========================================
  // Get Initials
  // ==========================================

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // ==========================================
  // Job Applicants
  // ==========================================

  const getJobApplicants = (jobId) => {
    return applicants.filter(
      (application) =>
        application.job?._id === jobId
    ).length;
  };

  // ==========================================
  // Stats Cards
  // ==========================================

  const stats = [
    {
      title: "Total Jobs",
      value: totalJobs,
      icon: <FaBriefcase />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "Total Applicants",
      value: totalApplicants,
      icon: <FaUsers />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Interviews",
      value: interviews,
      icon: <FaCalendarAlt />,
      bg: "bg-pink-100",
      color: "text-pink-600",
    },
    {
      title: "Hired",
      value: hired,
      icon: <FaUserCheck />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ==========================================
          Header
      ========================================== */}

      <header className="bg-[#070B2B] text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="min-h-20 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold">
                Career
                <span className="text-purple-500">
                  Connect
                </span>
              </h1>

              <p className="text-gray-400 text-sm mt-1">
                Employer Panel
              </p>

            </div>

            <Link
              to="/employer-dashboard"
              className="inline-flex items-center justify-center gap-2 text-sm text-gray-300 hover:text-purple-400 transition"
            >
              <FaArrowLeft />
              Dashboard
            </Link>

          </div>

        </div>

      </header>

      {/* ==========================================
          Main
      ========================================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Heading */}

        <div className="mb-7">

          <p className="text-sm text-purple-600 font-medium">
            EMPLOYER PANEL
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            Analytics
          </h1>

          <p className="text-gray-500 mt-2">
            Track your recruitment performance
            and application activity.
          </p>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* ==========================================
            Stats
        ========================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {stats.map((stat) => (

            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-2">
                    {loading
                      ? "..."
                      : stat.value}
                  </h2>

                </div>

                <div
                  className={`
                    w-12 h-12 rounded-xl
                    flex items-center justify-center
                    text-lg
                    ${stat.bg}
                    ${stat.color}
                  `}
                >
                  {stat.icon}
                </div>

              </div>

            </div>

          ))}

        </div>

        {/* ==========================================
            Application Overview + Status
        ========================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

          {/* Application Overview */}

          <div className="bg-white rounded-xl shadow-lg p-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-lg font-bold text-gray-900">
                  Application Overview
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Current recruitment activity
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <FaChartLine />
              </div>

            </div>

            {/* Chart */}

            <div className="mt-8 h-56 flex items-end justify-between gap-3">

              {[
                {
                  label: "Jobs",
                  value: totalJobs,
                },
                {
                  label: "Applicants",
                  value: totalApplicants,
                },
                {
                  label: "Shortlisted",
                  value: shortlisted,
                },
                {
                  label: "Interviews",
                  value: interviews,
                },
                {
                  label: "Hired",
                  value: hired,
                },
              ].map((item) => {

                const maxValue =
                  Math.max(
                    totalApplicants,
                    totalJobs,
                    shortlisted,
                    interviews,
                    hired,
                    1
                  );

                const height =
                  Math.max(
                    (item.value / maxValue) *
                      100,
                    item.value > 0 ? 8 : 3
                  );

                return (

                  <div
                    key={item.label}
                    className="flex-1 h-full flex flex-col items-center justify-end gap-2"
                  >

                    <span className="text-xs font-semibold text-gray-600">
                      {loading
                        ? "..."
                        : item.value}
                    </span>

                    <div
                      className="w-full max-w-14 bg-purple-200 hover:bg-purple-500 rounded-t-lg transition"
                      style={{
                        height: `${height}%`,
                      }}
                    ></div>

                    <span className="text-xs text-gray-400 text-center">
                      {item.label}
                    </span>

                  </div>

                );
              })}

            </div>

          </div>

          {/* Application Status */}

          <div className="bg-white rounded-xl shadow-lg p-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-lg font-bold text-gray-900">
                  Application Status
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Candidate application breakdown
                </p>

              </div>

              <FaUsers className="text-purple-500 text-xl" />

            </div>

            <div className="mt-7 space-y-5">

              {/* Applied */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-2">

                    <FaClock className="text-yellow-500 text-sm" />

                    <span className="text-sm font-medium text-gray-700">
                      Applied
                    </span>

                  </div>

                  <span className="text-sm font-semibold text-gray-900">
                    {pending}
                  </span>

                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{
                      width: `${getPercentage(
                        pending
                      )}%`,
                    }}
                  ></div>

                </div>

              </div>

              {/* Reviewed */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-2">

                    <FaCheckCircle className="text-blue-500 text-sm" />

                    <span className="text-sm font-medium text-gray-700">
                      Reviewed
                    </span>

                  </div>

                  <span className="text-sm font-semibold text-gray-900">
                    {reviewed}
                  </span>

                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{
                      width: `${getPercentage(
                        reviewed
                      )}%`,
                    }}
                  ></div>

                </div>

              </div>

              {/* Shortlisted */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-2">

                    <FaCheckCircle className="text-green-500 text-sm" />

                    <span className="text-sm font-medium text-gray-700">
                      Shortlisted
                    </span>

                  </div>

                  <span className="text-sm font-semibold text-gray-900">
                    {shortlisted}
                  </span>

                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{
                      width: `${getPercentage(
                        shortlisted
                      )}%`,
                    }}
                  ></div>

                </div>

              </div>

              {/* Interview */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-2">

                    <FaCalendarAlt className="text-purple-500 text-sm" />

                    <span className="text-sm font-medium text-gray-700">
                      Interview
                    </span>

                  </div>

                  <span className="text-sm font-semibold text-gray-900">
                    {interviews}
                  </span>

                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{
                      width: `${getPercentage(
                        interviews
                      )}%`,
                    }}
                  ></div>

                </div>

              </div>

              {/* Hired */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-2">

                    <FaUserCheck className="text-green-600 text-sm" />

                    <span className="text-sm font-medium text-gray-700">
                      Hired
                    </span>

                  </div>

                  <span className="text-sm font-semibold text-gray-900">
                    {hired}
                  </span>

                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-green-600 rounded-full transition-all"
                    style={{
                      width: `${getPercentage(
                        hired
                      )}%`,
                    }}
                  ></div>

                </div>

              </div>

              {/* Rejected */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-2">

                    <FaTimesCircle className="text-red-500 text-sm" />

                    <span className="text-sm font-medium text-gray-700">
                      Rejected
                    </span>

                  </div>

                  <span className="text-sm font-semibold text-gray-900">
                    {rejected}
                  </span>

                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-red-500 rounded-full transition-all"
                    style={{
                      width: `${getPercentage(
                        rejected
                      )}%`,
                    }}
                  ></div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ==========================================
            Job Performance
        ========================================== */}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">

          <div className="p-5 border-b">

            <h2 className="text-lg font-bold text-gray-900">
              Job Performance
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Applicant performance for each posted job
            </p>

          </div>

          {loading ? (

            <div className="p-10 text-center">

              <div className="w-9 h-9 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>

              <p className="text-gray-500 mt-3">
                Loading analytics...
              </p>

            </div>

          ) : jobs.length === 0 ? (

            <div className="p-10 text-center">

              <div className="w-14 h-14 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
                <FaBriefcase />
              </div>

              <h3 className="font-semibold text-gray-900 mt-4">
                No Jobs Available
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Post a job to start seeing analytics.
              </p>

            </div>

          ) : (

            <div className="divide-y">

              {jobs.map((job) => {

                const jobApplicants =
                  getJobApplicants(job._id);

                const jobPercentage =
                  totalApplicants > 0
                    ? Math.round(
                        (jobApplicants /
                          totalApplicants) *
                          100
                      )
                    : 0;

                const logoUrl =
  getCompanyLogoUrl(job?.company?.logo) ||
  "http://localhost:5000/uploads/logos/careerconnect.png";

                return (

                  <div
                    key={job._id}
                    className="p-5 hover:bg-gray-50 transition"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                      {/* =========================
                          Job Information
                      ========================= */}

                      <div className="flex items-start gap-4 min-w-0">

                        {/* Company Logo */}

                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">

                          {logoUrl ? (

                            <img
                              src={logoUrl}
                              alt={
                                job?.company?.name ||
                                "Company"
                              }
                              className="w-full h-full object-contain p-2"
                              onLoad={() => {
                                console.log(
                                  "ANALYTICS LOGO LOADED:",
                                  logoUrl
                                );
                              }}
                              onError={(e) => {
                                console.error(
                                  "ANALYTICS LOGO FAILED:",
                                  logoUrl
                                );

                                e.currentTarget.style.display =
                                  "none";

                                const fallback =
                                  e.currentTarget.parentElement.querySelector(
                                    ".analytics-logo-fallback"
                                  );

                                if (fallback) {
                                  fallback.classList.remove(
                                    "hidden"
                                  );

                                  fallback.classList.add(
                                    "flex"
                                  );
                                }
                              }}
                            />

                          ) : null}

                          {/* Fallback */}

                          <div
                            className={`analytics-logo-fallback ${
                              logoUrl
                                ? "hidden"
                                : "flex"
                            } w-full h-full items-center justify-center bg-purple-100 text-purple-600`}
                          >
                            <FaBriefcase />
                          </div>

                        </div>

                        {/* Job Details */}

                        <div className="min-w-0">

                          <h3 className="font-semibold text-gray-900 truncate">
                            {job?.title ||
                              "Job"}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1 truncate">
                            {job?.company?.name ||
                              "Company"}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {job?.location ||
                              "Location"}
                          </p>

                        </div>

                      </div>

                      {/* =========================
                          Job Stats
                      ========================= */}

                      <div className="flex flex-wrap items-center gap-6">

                        <div>
                          <p className="text-xs text-gray-400">
                            Applicants
                          </p>

                          <p className="text-lg font-bold text-gray-900 mt-1">
                            {jobApplicants}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Share
                          </p>

                          <p className="text-lg font-bold text-purple-600 mt-1">
                            {jobPercentage}%
                          </p>
                        </div>

                        <Link
                          to={`/employer/applications/${job._id}`}
                          className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-purple-500 hover:text-purple-600 transition"
                        >
                          View Applicants
                        </Link>

                      </div>

                    </div>

                    {/* Progress */}

                    <div className="mt-4">

                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-purple-500 rounded-full transition-all"
                          style={{
                            width: `${jobPercentage}%`,
                          }}
                        ></div>

                      </div>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </div>

        {/* ==========================================
            Recent Applications
        ========================================== */}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">

          <div className="p-5 border-b flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                Recent Applications
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Latest candidate activity
              </p>

            </div>

            <FaUsers className="text-purple-500" />

          </div>

          {loading ? (

            <div className="p-8 text-center text-gray-500">
              Loading applications...
            </div>

          ) : applicants.length === 0 ? (

            <div className="p-8 text-center text-gray-500">
              No applications yet.
            </div>

          ) : (

            <div className="divide-y">

              {applicants
                .slice(0, 6)
                .map((application) => {

                  const candidate =
                    application.candidate || {};

                  const job =
                    application.job || {};

                  const logoUrl =
                    getCompanyLogoUrl(
                      job?.company?.logo
                    );

                  return (

                    <div
                      key={application._id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition"
                    >

                      <div className="flex items-center gap-3">

                        {/* Company Logo */}

                        <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">

                          {logoUrl ? (

                            <img
                              src={logoUrl}
                              alt={
                                job?.company?.name ||
                                "Company"
                              }
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                console.error(
                                  "RECENT APPLICATION LOGO FAILED:",
                                  logoUrl
                                );

                                e.currentTarget.style.display =
                                  "none";

                                const fallback =
                                  e.currentTarget.parentElement.querySelector(
                                    ".recent-logo-fallback"
                                  );

                                if (fallback) {
                                  fallback.classList.remove(
                                    "hidden"
                                  );

                                  fallback.classList.add(
                                    "flex"
                                  );
                                }
                              }}
                            />

                          ) : null}

                          <div
                            className={`recent-logo-fallback ${
                              logoUrl
                                ? "hidden"
                                : "flex"
                            } w-full h-full items-center justify-center bg-purple-100 text-purple-600`}
                          >
                            <FaBriefcase />
                          </div>

                        </div>

                        {/* Candidate + Job */}

                        <div>

                          <h3 className="font-semibold text-gray-900">
                            {candidate.name ||
                              "Candidate"}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {job.title || "Job"}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {formatTime(
                              application.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                      {/* Status + View */}

                      <div className="flex items-center gap-3">

                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-medium">
                          <FaCheckCircle />

                          {application.status ||
                            "Applied"}
                        </span>

                        {job._id && (

                          <Link
                            to={`/employer/applications/${job._id}`}
                            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                          >
                            View
                          </Link>

                        )}

                      </div>

                    </div>

                  );
                })}

            </div>

          )}

        </div>

      </main>

    </div>
  );
};

export default Analytics;

