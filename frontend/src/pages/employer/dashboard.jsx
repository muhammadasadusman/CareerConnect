import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  FaBriefcase,
  FaUsers,
  FaBuilding,
  FaEnvelope,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaPlus,
  FaMapMarkerAlt,
  FaEye,
  FaUserCheck,
  FaCalendarAlt,
  FaArrowRight,
  FaCheckCircle,
  FaTrash,
} from "react-icons/fa";

import API from "../../api/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Unread Messages
  // ==========================================

  const [unreadMessages, setUnreadMessages] = useState(0);

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    console.log("LOGOUT CLICKED");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    console.log(
      "TOKEN AFTER LOGOUT:",
      localStorage.getItem("token")
    );

    console.log(
      "USER AFTER LOGOUT:",
      localStorage.getItem("user")
    );

    setJobs([]);
    setApplicants([]);
    setUnreadMessages(0);
    setSidebarOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // Fetch Unread Messages
  // ==========================================

  const fetchUnreadMessages = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUnreadMessages(0);
        return;
      }

      const response = await API.get("/messages/unread");

      setUnreadMessages(
        response.data.count || 0
      );
    } catch (error) {
      console.error(
        "Unread Messages Error:",
        error.response?.data ||
          error.message
      );

      // If token expired
      if (error.response?.status === 401) {
        setUnreadMessages(0);
      }
    }
  };

  // ==========================================
  // Delete Job
  // ==========================================

  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/jobs/${jobId}`);

      // Remove deleted job from UI
      setJobs((prevJobs) =>
        prevJobs.filter(
          (job) => job._id !== jobId
        )
      );

      // Remove related applicants from UI
      setApplicants((prevApplicants) =>
        prevApplicants.filter(
          (application) =>
            application.job?._id !== jobId
        )
      );

      alert("Job deleted successfully!");
    } catch (error) {
      console.error(
        "Delete Job Error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to delete job."
      );
    }
  };

  // ==========================================
  // Fetch Recruiter Dashboard
  // ==========================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      try {
        setLoading(true);
        setError("");

        // ==========================================
        // Get Recruiter's Own Jobs
        // ==========================================

        const jobsResponse =
          await API.get("/jobs/my-jobs");

        console.log(
          "MY JOBS RESPONSE:",
          jobsResponse.data
        );

        const recruiterJobs =
          jobsResponse.data.jobs || [];

        setJobs(recruiterJobs);

        // ==========================================
        // Get Applications For Each Job
        // ==========================================

        const applicationResponses =
          await Promise.all(
            recruiterJobs.map(
              async (job) => {
                try {
                  const response =
                    await API.get(
                      `/applications/job/${job._id}`
                    );

                  return (
                    response.data
                      .applications || []
                  );
                } catch (err) {
                  console.error(
                    `Failed to load applications for job ${job._id}:`,
                    err.response?.data ||
                      err.message
                  );

                  if (
                    err.response?.status ===
                    401
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
              }
            )
          );

        // ==========================================
        // Combine Applications
        // ==========================================

        const allApplications =
          applicationResponses.flat();

        allApplications.sort(
          (a, b) =>
            new Date(
              b.createdAt || 0
            ) -
            new Date(
              a.createdAt || 0
            )
        );

        setApplicants(
          allApplications
        );

        // ==========================================
        // Get Unread Messages
        // ==========================================

        await fetchUnreadMessages();

      } catch (err) {
        console.error(
          "Recruiter Dashboard Error:",
          err
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

          return;
        }

        setError(
          err.response?.data?.message ||
            "Failed to load recruiter dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // ==========================================
  // Auto Refresh Unread Messages
  // ==========================================

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) return;

    // Initial fetch
    fetchUnreadMessages();

    // Check every 5 seconds
    const interval = setInterval(() => {
      fetchUnreadMessages();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ==========================================
  // Stats
  // ==========================================

  const activeJobs = jobs.length;

  const totalApplicants =
    applicants.length;

  const interviews =
    applicants.filter(
      (application) =>
        application.status ===
        "Interview"
    ).length;

  const hired =
    applicants.filter(
      (application) =>
        application.status === "Hired"
    ).length;

  const stats = [
    {
      title: "Active Jobs",
      value: activeJobs,
      icon: <FaBriefcase />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Applicants",
      value: totalApplicants,
      icon: <FaUsers />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Interviews",
      value: interviews,
      icon: <FaCalendarAlt />,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      title: "Hired",
      value: hired,
      icon: <FaUserCheck />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

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
  // Applicant Initials
  // ==========================================

  const getInitials = (name) => {
    if (!name) return "C";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // ==========================================
  // Applicant Background
  // ==========================================

  const getApplicantBg = (index) => {
    const backgrounds = [
      "bg-purple-100 text-purple-600",
      "bg-pink-100 text-pink-600",
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
    ];

    return backgrounds[
      index % backgrounds.length
    ];
  };

  // ==========================================
  // Status Style
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Shortlisted":
        return "bg-green-100 text-green-600";

      case "Rejected":
        return "bg-red-100 text-red-600";

      case "Reviewed":
        return "bg-blue-100 text-blue-600";

      case "Interview":
        return "bg-purple-100 text-purple-600";

      case "Hired":
        return "bg-green-100 text-green-700";

      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ==========================================
          Mobile Header
      ========================================== */}

      <div className="lg:hidden bg-[#070B2B] text-white px-4 py-4 flex items-center justify-between">

        <h1 className="text-xl font-bold">
          Career
          <span className="text-purple-500">
            Connect
          </span>
        </h1>

        <button
          onClick={() =>
            setSidebarOpen(
              !sidebarOpen
            )
          }
          className="text-xl"
        >
          {sidebarOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>

      </div>

      {/* ==========================================
          Overlay
      ========================================== */}

      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        ></div>
      )}

      {/* ==========================================
          Sidebar
      ========================================== */}

      <aside
        className={`
          fixed top-0 left-0 z-40
          w-64 h-screen
          bg-[#070B2B] text-white
          flex flex-col
          transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >

        {/* Logo */}

        <div className="h-20 flex items-center px-6 border-b border-white/10">

          <h1 className="text-2xl font-bold">
            Career
            <span className="text-purple-500">
              Connect
            </span>
          </h1>

        </div>

        {/* Company Profile */}

        <div className="px-5 py-6 border-b border-white/10">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-lg font-bold">
              CC
            </div>

            <div>

              <h3 className="font-semibold">
                CareerConnect
              </h3>

              <p className="text-xs text-gray-400">
                Recruiter
              </p>

            </div>

          </div>

        </div>

        {/* Navigation */}

        <nav className="flex-1 px-4 py-6 overflow-y-auto">

          <p className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-3">
            Main Menu
          </p>

          <div className="space-y-2">

            {/* Dashboard */}

            <button
              onClick={() =>
                setSidebarOpen(false)
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600 text-white"
            >
              <FaChartLine />
              Dashboard
            </button>

            {/* My Jobs */}

            <Link
              to="/employer/jobs"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-purple-400 transition"
            >
              <FaBriefcase />
              My Jobs
            </Link>

            {/* Applicants */}

            <Link
              to={
                jobs.length > 0
                  ? `/employer/applications/${jobs[0]._id}`
                  : "/employer-dashboard"
              }
              onClick={() =>
                setSidebarOpen(false)
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-purple-400 transition"
            >
              <FaUsers />
              Applicants
            </Link>

            {/* Company */}

            <Link
              to="/employer/company-profile"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-purple-400 transition"
            >
              <FaBuilding />
              Company Profile
            </Link>




{/* Interviews */}

<Link
  to="/employer/schedule-interview"
  onClick={() => setSidebarOpen(false)}
  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-purple-400 transition"
>
  <FaCalendarAlt />
  <span className="flex-1 text-left">
    Interviews
  </span>
</Link>



            {/* ==========================================
                Messages + Unread Badge
            ========================================== */}

            <Link
              to="/employer/messages"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-purple-400 transition"
            >
              <FaEnvelope />

              <span className="flex-1 text-left">
                Messages
              </span>

              {unreadMessages > 0 && (
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {unreadMessages > 99
                    ? "99+"
                    : unreadMessages}
                </span>
              )}
            </Link>

            {/* Analytics */}

            <Link
  to="/employer/analytics"
  onClick={() => setSidebarOpen(false)}
  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-purple-400 transition"
>
  <FaChartLine />
  Analytics
</Link>

          </div>

          <p className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-3 mt-8">
            Account
          </p>

          <div className="space-y-2">

            <Link
  to="/employer/settings"
  onClick={() => setSidebarOpen(false)}
  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-purple-400 transition"
>
  <FaCog />
  Settings
</Link>

          </div>

        </nav>

        {/* Logout */}

        <div className="p-4 border-t border-white/10">

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-purple-600 hover:text-white rounded-lg transition"
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>

      </aside>

      {/* ==========================================
          Main Content
      ========================================== */}

      <main className="lg:ml-64">

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

          {/* Welcome */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

            <div>

              <p className="text-gray-500 text-sm">
                Sunday, August 16, 2026
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                Welcome back, Recruiter! 👋
              </h1>

              <p className="text-gray-500 mt-2">
                Manage your jobs and applicants from your dashboard.
              </p>

            </div>

            <Link
              to="/post-job"
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg transition"
            >
              <FaPlus />
              Post a Job
            </Link>

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
                className="bg-white rounded-xl shadow-lg p-5"
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
                      ${stat.iconBg}
                      ${stat.iconColor}
                    `}
                  >
                    {stat.icon}
                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* ==========================================
              Applicants + Overview
          ========================================== */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

            {/* Recent Applicants */}

            <div className="xl:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">

              <div className="flex items-center justify-between p-5 border-b">

                <div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Recent Applicants
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Latest candidates who applied for your jobs
                  </p>

                </div>

                {jobs.length > 0 ? (
                  <Link
                    to={`/employer/applications/${jobs[0]._id}`}
                    className="text-sm text-purple-600 font-medium hover:text-purple-800 flex items-center gap-1"
                  >
                    View All
                    <FaArrowRight className="text-xs" />
                  </Link>
                ) : (
                  <span className="text-sm text-gray-400">
                    View All
                  </span>
                )}

              </div>

              <div className="divide-y">

                {loading ? (

                  <div className="p-10 text-center">

                    <div className="w-9 h-9 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>

                    <p className="text-gray-500 mt-3">
                      Loading applicants...
                    </p>

                  </div>

                ) : applicants.length === 0 ? (

                  <div className="p-10 text-center">

                    <div className="w-14 h-14 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
                      <FaUsers />
                    </div>

                    <h3 className="font-semibold text-gray-900 mt-4">
                      No Applicants Yet
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Candidates who apply to your jobs will appear here.
                    </p>

                  </div>

                ) : (

                  applicants
                    .slice(0, 5)
                    .map(
                      (
                        application,
                        index
                      ) => {

                        const candidate =
                          application.candidate ||
                          {};

                        const job =
                          application.job ||
                          {};

                        return (
                          <div
                            key={
                              application._id
                            }
                            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition"
                          >

                            <div className="flex items-center gap-4">

                              
{/* Company Logo */}
<div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">

  {job?.company?.logo ? (
    <img
      src={
        job.company.logo.startsWith("http")
          ? job.company.logo
          : `http://localhost:5000${job.company.logo}`
      }
      alt={job?.company?.name || "Company"}
      className="w-full h-full object-contain p-2"
      onError={(e) => {
        console.error(
          "RECENT APPLICANT LOGO FAILED:",
          `http://localhost:5000${job.company.logo}`
        );

        e.currentTarget.style.display = "none";

        const fallback =
          e.currentTarget.parentElement.querySelector(
            ".applicant-logo-fallback"
          );

        if (fallback) {
          fallback.classList.remove("hidden");
          fallback.classList.add("flex");
        }
      }}
    />
  ) : null}

  {/* Fallback */}
  <div
    className={`applicant-logo-fallback ${
      job?.company?.logo ? "hidden" : "flex"
    } w-full h-full items-center justify-center bg-purple-100 text-purple-600`}
  >
    <FaBriefcase />
  </div>

</div>


                              <div>

                                <h3 className="font-semibold text-gray-900">
                                  {candidate.name ||
                                    "Candidate"}
                                </h3>

                                <p className="text-sm text-gray-600">
                                  {job.title ||
                                    "Job"}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                  {formatTime(
                                    application.createdAt
                                  )}
                                </p>

                              </div>

                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4">

                              <div className="text-right">

                                <p
                                  className={`
                                    inline-flex items-center gap-1
                                    px-2.5 py-1 rounded-full
                                    text-xs font-medium
                                    ${getStatusStyle(
                                      application.status
                                    )}
                                  `}
                                >
                                  <FaCheckCircle />

                                  {application.status ||
                                    "Applied"}
                                </p>

                              </div>

                              {job._id ? (
                                <Link
                                  to={`/employer/applications/${job._id}`}
                                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-purple-600 hover:border-purple-500 transition"
                                  title="View Applicant"
                                >
                                  <FaEye />
                                </Link>
                              ) : (
                                <button
                                  disabled
                                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-300 cursor-not-allowed"
                                >
                                  <FaEye />
                                </button>
                              )}

                            </div>

                          </div>
                        );
                      }
                    )

                )}

              </div>

            </div>

            {/* Applications Overview */}

            <div className="bg-white rounded-xl shadow-lg p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Applications Overview
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Current applications
                  </p>

                </div>

                <FaChartLine className="text-purple-500" />

              </div>

              <div className="mt-8 h-48 flex items-end justify-between gap-2">

                {[
                  35,
                  55,
                  45,
                  70,
                  60,
                  90,
                  65,
                ].map(
                  (
                    height,
                    index
                  ) => (

                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center gap-2"
                    >

                      <div
                        className="w-full bg-purple-200 hover:bg-purple-500 rounded-t-lg transition"
                        style={{
                          height: `${height}%`,
                        }}
                      ></div>

                      <span className="text-xs text-gray-400">
                        {
                          [
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun",
                          ][index]
                        }
                      </span>

                    </div>

                  )
                )}

              </div>

              <div className="mt-5 pt-5 border-t">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-500">
                    Total Applications
                  </span>

                  <span className="font-bold text-gray-900">
                    {loading
                      ? "..."
                      : totalApplicants}
                  </span>

                </div>

                <div className="flex items-center gap-2 mt-2">

                  <FaChartLine className="text-green-500" />

                  <span className="text-xs text-green-600">
                    Live database data
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* ==========================================
              My Jobs
          ========================================== */}

          <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b">

              <div>

                <h2 className="text-lg font-bold text-gray-900">
                  My Jobs
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Manage your recently posted jobs
                </p>

              </div>

              {jobs.length > 0 ? (
                <Link
                  to={`/employer/applications/${jobs[0]._id}`}
                  className="text-sm text-purple-600 font-medium hover:text-purple-800 flex items-center gap-1"
                >
                  View All Jobs
                  <FaArrowRight className="text-xs" />
                </Link>
              ) : (
                <span className="text-sm text-gray-400">
                  View All Jobs
                </span>
              )}

            </div>

            <div className="divide-y">

              {loading ? (

                <div className="p-10 text-center">

                  <div className="w-9 h-9 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>

                  <p className="text-gray-500 mt-3">
                    Loading your jobs...
                  </p>

                </div>

              ) : jobs.length === 0 ? (

                <div className="p-10 text-center">

                  <div className="w-14 h-14 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
                    <FaBriefcase />
                  </div>

                  <h3 className="font-semibold text-gray-900 mt-4">
                    No Jobs Posted
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Start by posting your first job.
                  </p>

                  <Link
                    to="/post-job"
                    className="inline-flex items-center gap-2 mt-5 bg-purple-600 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg transition"
                  >
                    <FaPlus />
                    Post a Job
                  </Link>

                </div>

              ) : (

                jobs.map((job) => {

                  const jobApplicants =
                    applicants.filter(
                      (application) =>
                        application.job?._id ===
                        job._id
                    ).length;

                  return (
                    <div
                      key={job._id}
                      className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-gray-50 transition"
                    >

                     {/* Job Info */}
<div className="flex items-start gap-4">

  {/* COMPANY LOGO */}
  <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">

    {job?.company?.logo ? (
      <img
        src={
          job.company.logo.startsWith("http")
            ? job.company.logo
            : `http://localhost:5000${job.company.logo}`
        }
        alt={job?.company?.name || "Company"}
        className="w-full h-full object-contain p-1.5"
        onError={(e) => {
          e.currentTarget.style.display = "none";

          const fallback =
            e.currentTarget.parentElement.querySelector(
              ".logo-fallback"
            );

          if (fallback) {
            fallback.classList.remove("hidden");
            fallback.classList.add("flex");
          }
        }}
      />
    ) : null}

    {/* Fallback */}
    <div
      className={`logo-fallback ${
        job?.company?.logo ? "hidden" : "flex"
      } w-full h-full items-center justify-center bg-purple-100 text-purple-600`}
    >
      <FaBriefcase />
    </div>

  </div>

  {/* JOB DETAILS */}
  <div className="min-w-0">

    <h3 className="font-semibold text-gray-900 truncate">
      {job?.title || "Untitled Job"}
    </h3>

    <p className="text-sm text-gray-500 mt-1">
      {job?.company?.name || "Company"}
    </p>

    <div className="flex flex-wrap items-center gap-3 mt-2">

      <span className="flex items-center gap-1 text-xs text-gray-500">
        <FaMapMarkerAlt className="text-purple-500" />
        {job?.location || "Location not specified"}
      </span>

      <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-medium">
        {job?.jobType || "Full Time"}
      </span>

    </div>

  </div>

</div>
                 

                      {/* Job Stats + Actions */}

                      <div className="flex flex-wrap items-center gap-4">

                        <div className="text-sm">

                          <p className="text-gray-400 text-xs">
                            Applicants
                          </p>

                          <p className="font-semibold text-gray-900 mt-1">
                            {jobApplicants}
                          </p>

                        </div>

                        <div className="text-sm">

                          <p className="text-gray-400 text-xs">
                            Salary
                          </p>

                          <p className="font-semibold text-gray-900 mt-1">
                            {job.salary ||
                              "Not specified"}
                          </p>

                        </div>

                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">

                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>

                          Active

                        </span>

                        {/* Actions */}

                        <div className="flex items-center gap-2">

                          {/* View Applications */}

                          <Link
                            to={`/employer/applications/${job._id}`}
                            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-purple-600 hover:border-purple-500 transition"
                            title="View Applications"
                          >
                            <FaArrowRight className="text-xs" />
                          </Link>

                          {/* Delete Job */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteJob(
                                job._id
                              )
                            }
                            className="w-9 h-9 rounded-lg border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition"
                            title="Delete Job"
                          >
                            <FaTrash className="text-sm" />
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                })

              )}

            </div>

          </div>

          {/* ==========================================
              Bottom Section
          ========================================== */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

            {/* Recent Activity */}

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">

              <div className="p-5 border-b">

                <h2 className="text-lg font-bold text-gray-900">
                  Recent Activity
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Latest activity on your account
                </p>

              </div>

              <div className="p-5 space-y-5">

                {loading ? (

                  <p className="text-sm text-gray-500">
                    Loading activity...
                  </p>

                ) : applicants.length > 0 ? (

                  applicants
                    .slice(0, 4)
                    .map(
                      (
                        application,
                        index
                      ) => {

                        const candidate =
                          application.candidate ||
                          {};

                        const job =
                          application.job ||
                          {};

                        return (
                          <div
                            key={
                              application._id
                            }
                            className="flex items-start gap-4"
                          >

                            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">

                              {index === 0 && (
                                <FaUsers />
                              )}

                              {index === 1 && (
                                <FaBriefcase />
                              )}

                              {index === 2 && (
                                <FaCalendarAlt />
                              )}

                              {index === 3 && (
                                <FaUserCheck />
                              )}

                            </div>

                            <div>

                              <p className="text-sm text-gray-700">

                                <span className="font-medium">
                                  {candidate.name ||
                                    "Candidate"}
                                </span>{" "}

                                applied for{" "}

                                <span className="font-medium">
                                  {job.title ||
                                    "your job"}
                                </span>

                              </p>

                              <p className="text-xs text-gray-400 mt-1">
                                {formatTime(
                                  application.createdAt
                                )}
                              </p>

                            </div>

                          </div>
                        );
                      }
                    )

                ) : (

                  <p className="text-sm text-gray-500">
                    No recent activity.
                  </p>

                )}

              </div>

            </div>

            {/* Quick Actions */}

            <div className="bg-white rounded-xl shadow-lg p-6">

              <h2 className="text-lg font-bold text-gray-900">
                Quick Actions
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Manage your recruitment activities
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                {/* Post Job */}

                <Link
                  to="/post-job"
                  className="p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition text-left"
                >

                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                    <FaPlus />
                  </div>

                  <h3 className="font-semibold text-gray-900 mt-3">
                    Post New Job
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Create a new job opening
                  </p>

                </Link>

                {/* Applicants */}

                <Link
                  to={
                    jobs.length > 0
                      ? `/employer/applications/${jobs[0]._id}`
                      : "/employer-dashboard"
                  }
                  className="p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition text-left"
                >

                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FaUsers />
                  </div>

                  <h3 className="font-semibold text-gray-900 mt-3">
                    View Applicants
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {totalApplicants} applicant
                    {totalApplicants !== 1
                      ? "s"
                      : ""}{" "}
                    available
                  </p>

                </Link>

                {/* Interview */}
<Link
  to={
    jobs.length > 0
      ? `/employer/schedule-interview/${jobs[0]._id}`
      : "/employer/schedule-interview"
  }
  className="p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition text-left"
>
  <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
    <FaCalendarAlt />
  </div>

  <h3 className="font-semibold text-gray-900 mt-3">
    Schedule Interview
  </h3>

  <p className="text-xs text-gray-500 mt-1">
    Manage candidate interviews
  </p>
</Link>
                {/* Company */}

                <Link
  to="/employer/company-profile"
  className="p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition text-left"
>
  <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
    <FaBuilding />
  </div>

  <h3 className="font-semibold text-gray-900 mt-3">
    Company Profile
  </h3>

  <p className="text-xs text-gray-500 mt-1">
    Update company information
  </p>
</Link>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Dashboard;