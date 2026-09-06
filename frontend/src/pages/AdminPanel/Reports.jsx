
import { useEffect, useMemo, useState } from "react";

import {
  FaChartLine,
  FaUsers,
  FaBriefcase,
  FaBuilding,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUserTie,
  FaCalendarAlt,
  FaSyncAlt,
  FaDownload,
  FaSearch,
  FaFilter,
  FaExclamationTriangle,
} from "react-icons/fa";

import API from "../../api/api";

const Reports = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    candidates: 0,
    recruiters: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
  });

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // =====================================================
  // FETCH DASHBOARD STATS
  // =====================================================

  const fetchDashboardStats = async () => {
    const response = await API.get(
      "/admin/dashboard"
    );

    if (response.data?.stats) {
      setDashboardStats(
        response.data.stats
      );
    }
  };

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {
    const response = await API.get(
      "/admin/users"
    );

    const data =
      response.data?.users ||
      response.data ||
      [];

    setUsers(
      Array.isArray(data) ? data : []
    );
  };

  // =====================================================
  // FETCH JOBS
  // =====================================================

  const fetchJobs = async () => {
    const response = await API.get(
      "/jobs"
    );

    const data =
      response.data?.jobs ||
      response.data ||
      [];

    setJobs(
      Array.isArray(data) ? data : []
    );
  };

  // =====================================================
  // FETCH COMPANIES
  // =====================================================

  const fetchCompanies = async () => {
    const response = await API.get(
      "/companies"
    );

    const data =
      response.data?.companies ||
      response.data ||
      [];

    setCompanies(
      Array.isArray(data) ? data : []
    );
  };

  // =====================================================
  // FETCH APPLICATIONS
  // =====================================================

  const fetchApplications = async () => {
    const response = await API.get(
      "/applications/admin"
    );

    const data =
      response.data?.applications ||
      response.data ||
      [];

    setApplications(
      Array.isArray(data) ? data : []
    );
  };

  // =====================================================
  // LOAD ALL REPORT DATA
  // =====================================================

  const loadReports = async (
    showLoader = true
  ) => {
    try {
      setError("");

      if (showLoader) {
        setLoading(true);
      }

      await Promise.all([
        fetchDashboardStats(),
        fetchUsers(),
        fetchJobs(),
        fetchCompanies(),
        fetchApplications(),
      ]);
    } catch (err) {
      console.error(
        "Reports Error:",
        err
      );

      if (
        err.response?.status === 401
      ) {
        handleLogout();
        return;
      }

      if (
        err.response?.status === 403
      ) {
        setError(
          "Access denied. Only administrators can view reports."
        );
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load reports."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadReports(true);
  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await loadReports(false);
    } catch (err) {
      console.error(
        "Refresh Reports Error:",
        err
      );

      setRefreshing(false);
    }
  };

  // =====================================================
  // APPLICATION HELPERS
  // =====================================================

  const getCandidate = (
    application
  ) => {
    return (
      application?.candidate ||
      application?.user ||
      application?.applicant ||
      {}
    );
  };

  const getJob = (
    application
  ) => {
    return application?.job || {};
  };

  const getCompany = (
    application
  ) => {
    const job =
      getJob(application);

    return (
      job?.company ||
      application?.company ||
      {}
    );
  };

  const getCandidateName = (
    application
  ) => {
    const candidate =
      getCandidate(application);

    return (
      candidate?.name ||
      candidate?.fullName ||
      "Unknown Candidate"
    );
  };

  const getCandidateEmail = (
    application
  ) => {
    const candidate =
      getCandidate(application);

    return (
      candidate?.email ||
      "No email"
    );
  };

  const getJobTitle = (
    application
  ) => {
    const job =
      getJob(application);

    return (
      job?.title ||
      application?.jobTitle ||
      "Unknown Job"
    );
  };

  const getCompanyName = (
    application
  ) => {
    const company =
      getCompany(application);

    if (
      typeof company === "string"
    ) {
      return company;
    }

    return (
      company?.name ||
      company?.companyName ||
      "Unknown Company"
    );
  };

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "N/A";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-PK",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // APPLICATION STATUS COUNTS
  // =====================================================

  const pendingApplications =
    applications.filter(
      (item) =>
        !item.status ||
        item.status === "Pending"
    ).length;

  const reviewedApplications =
    applications.filter(
      (item) =>
        item.status === "Reviewed"
    ).length;

  const shortlistedApplications =
    applications.filter(
      (item) =>
        item.status === "Shortlisted"
    ).length;

  const interviewApplications =
    applications.filter(
      (item) =>
        item.status === "Interview"
    ).length;

  const hiredApplications =
    applications.filter(
      (item) =>
        item.status === "Hired"
    ).length;

  const rejectedApplications =
    applications.filter(
      (item) =>
        item.status === "Rejected"
    ).length;

  // =====================================================
  // APPLICATION PERCENTAGE
  // =====================================================

  const getPercentage = (
    value
  ) => {
    const total =
      applications.length ||
      dashboardStats.totalApplications ||
      0;

    if (!total) {
      return 0;
    }

    return Math.round(
      (value / total) * 100
    );
  };

  // =====================================================
  // FILTER APPLICATIONS
  // =====================================================

  const filteredApplications =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase();

      return applications.filter(
        (application) => {
          const name =
            getCandidateName(
              application
            ).toLowerCase();

          const email =
            getCandidateEmail(
              application
            ).toLowerCase();

          const job =
            getJobTitle(
              application
            ).toLowerCase();

          const company =
            getCompanyName(
              application
            ).toLowerCase();

          const matchesSearch =
            !searchText ||
            name.includes(
              searchText
            ) ||
            email.includes(
              searchText
            ) ||
            job.includes(
              searchText
            ) ||
            company.includes(
              searchText
            );

          const matchesStatus =
            statusFilter ===
              "All" ||
            (
              application.status ||
              "Pending"
            ) === statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      applications,
      search,
      statusFilter,
    ]);

  // =====================================================
  // EXPORT CSV
  // =====================================================

  const exportCSV = () => {
    if (
      filteredApplications.length ===
      0
    ) {
      alert(
        "There is no application data to export."
      );

      return;
    }

    const headers = [
      "Candidate",
      "Email",
      "Job",
      "Company",
      "Status",
      "Applied Date",
    ];

    const rows =
      filteredApplications.map(
        (application) => [
          getCandidateName(
            application
          ),
          getCandidateEmail(
            application
          ),
          getJobTitle(
            application
          ),
          getCompanyName(
            application
          ),
          application.status ||
            "Pending",
          formatDate(
            application.createdAt
          ),
        ]
      );

    const csvData = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => {
            const text =
              String(
                value ?? ""
              );

            return `"${text.replace(
              /"/g,
              '""'
            )}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob =
      new Blob(
        [csvData],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `careerconnect-report-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(
      url
    );
  };

  // =====================================================
  // REPORT CARDS
  // =====================================================

  const reportCards = [
    {
      title: "Total Users",
      value:
        dashboardStats.totalUsers ??
        users.length,
      subtitle:
        "Registered users",
      icon: <FaUsers />,
      bg: "bg-purple-100",
      color:
        "text-purple-600",
    },

    {
      title: "Total Jobs",
      value:
        dashboardStats.totalJobs ??
        jobs.length,
      subtitle:
        "Jobs posted",
      icon: <FaBriefcase />,
      bg: "bg-blue-100",
      color:
        "text-blue-600",
    },

    {
      title: "Companies",
      value:
        dashboardStats.totalCompanies ??
        companies.length,
      subtitle:
        "Registered companies",
      icon: <FaBuilding />,
      bg: "bg-green-100",
      color:
        "text-green-600",
    },

    {
      title: "Applications",
      value:
        dashboardStats.totalApplications ??
        applications.length,
      subtitle:
        "Total applications",
      icon: <FaFileAlt />,
      bg: "bg-orange-100",
      color:
        "text-orange-600",
    },
  ];

  // =====================================================
  // STATUS REPORT
  // =====================================================

  const statusReports = [
    {
      label: "Pending",
      value:
        pendingApplications,
      icon: <FaClock />,
      bg: "bg-yellow-100",
      color:
        "text-yellow-600",
      bar: "bg-yellow-500",
    },

    {
      label: "Reviewed",
      value:
        reviewedApplications,
      icon: <FaFileAlt />,
      bg: "bg-purple-100",
      color:
        "text-purple-600",
      bar: "bg-purple-500",
    },

    {
      label: "Shortlisted",
      value:
        shortlistedApplications,
      icon: <FaCheckCircle />,
      bg: "bg-green-100",
      color:
        "text-green-600",
      bar: "bg-green-500",
    },

    {
      label: "Interview",
      value:
        interviewApplications,
      icon: <FaCalendarAlt />,
      bg: "bg-blue-100",
      color:
        "text-blue-600",
      bar: "bg-blue-500",
    },

    {
      label: "Hired",
      value:
        hiredApplications,
      icon: <FaCheckCircle />,
      bg: "bg-emerald-100",
      color:
        "text-emerald-600",
      bar: "bg-emerald-500",
    },

    {
      label: "Rejected",
      value:
        rejectedApplications,
      icon: <FaTimesCircle />,
      bg: "bg-red-100",
      color:
        "text-red-600",
      bar: "bg-red-500",
    },
  ];

  // =====================================================
  // USER REPORT
  // =====================================================

  const candidateCount =
    dashboardStats.candidates ??
    users.filter(
      (user) =>
        user.role ===
        "candidate"
    ).length;

  const recruiterCount =
    dashboardStats.recruiters ??
    users.filter(
      (user) =>
        user.role ===
        "recruiter"
    ).length;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">

        <div className="flex flex-col items-center gap-3 text-gray-500">

          <FaSyncAlt className="text-3xl text-purple-600 animate-spin" />

          <p>
            Loading reports...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="w-full">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-7">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl shrink-0">
              <FaChartLine />
            </div>

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Reports
              </h1>

              <p className="text-gray-500 mt-1">
                Real-time CareerConnect platform analytics
              </p>

            </div>

          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-3">

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-5 py-3 rounded-lg transition font-medium"
          >

            <FaSyncAlt
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-5 py-3 rounded-lg transition font-medium"
          >

            <FaDownload />

            Export CSV

          </button>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-3">

          <FaExclamationTriangle />

          <span>
            {error}
          </span>

        </div>
      )}

      {/* =================================================
          MAIN STATS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">

        {reportCards.map(
          (card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-5 hover:-translate-y-1 transition duration-300"
            >

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-sm text-gray-500">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {card.value}
                  </h2>

                  <p className="text-xs text-gray-400 mt-1">
                    {card.subtitle}
                  </p>

                </div>

                <div
                  className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center text-xl shrink-0`}
                >
                  {card.icon}
                </div>

              </div>

            </div>
          )
        )}

      </div>

      {/* =================================================
          USER + JOB REPORT
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-7">

        {/* USERS */}

        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <FaUsers />
            </div>

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                User Report
              </h2>

              <p className="text-sm text-gray-500">
                User distribution
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="border border-gray-200 rounded-xl p-4">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Candidates
                  </p>

                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {candidateCount}
                  </p>

                </div>

                <div className="w-11 h-11 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FaUsers />
                </div>

              </div>

            </div>

            <div className="border border-gray-200 rounded-xl p-4">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Recruiters
                  </p>

                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {recruiterCount}
                  </p>

                </div>

                <div className="w-11 h-11 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FaUserTie />
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* JOBS */}

        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FaBriefcase />
            </div>

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                Job Report
              </h2>

              <p className="text-sm text-gray-500">
                Job posting overview
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="border border-gray-200 rounded-xl p-4">

              <p className="text-sm text-gray-500">
                Total Jobs
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {dashboardStats.totalJobs ??
                  jobs.length}
              </p>

            </div>

            <div className="border border-gray-200 rounded-xl p-4">

              <p className="text-sm text-gray-500">
                Active Jobs
              </p>

              <p className="text-2xl font-bold text-green-600 mt-1">
                {dashboardStats.activeJobs ??
                  0}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          APPLICATION STATUS
      ================================================= */}

      <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 mb-7">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <FaFileAlt />
            </div>

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                Application Status
              </h2>

              <p className="text-sm text-gray-500">
                Current application distribution
              </p>

            </div>

          </div>

          <div className="text-sm text-gray-500">
            Total:{" "}
            <span className="font-bold text-gray-900">
              {applications.length}
            </span>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {statusReports.map(
            (item) => (
              <div
                key={item.label}
                className="border border-gray-200 rounded-xl p-4"
              >

                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <div
                      className={`w-10 h-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center`}
                    >
                      {item.icon}
                    </div>

                    <div>

                      <p className="text-sm font-medium text-gray-700">
                        {item.label}
                      </p>

                      <p className="text-xl font-bold text-gray-900">
                        {item.value}
                      </p>

                    </div>

                  </div>

                  <span className="text-sm font-semibold text-gray-500">
                    {getPercentage(
                      item.value
                    )}
                    %
                  </span>

                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">

                  <div
                    className={`h-full ${item.bar} rounded-full transition-all duration-500`}
                    style={{
                      width: `${getPercentage(
                        item.value
                      )}%`,
                    }}
                  />

                </div>

              </div>
            )
          )}

        </div>

      </div>

      {/* =================================================
          APPLICATION FILTERS
      ================================================= */}

      <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 mb-7">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <FaFilter />
          </div>

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              Application Report
            </h2>

            <p className="text-sm text-gray-500">
              Search and filter applications
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* SEARCH */}

          <div className="lg:col-span-2 relative">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search candidate, email, job or company..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
            />

          </div>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition bg-white"
          >

            <option value="All">
              All Statuses
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Reviewed">
              Reviewed
            </option>

            <option value="Shortlisted">
              Shortlisted
            </option>

            <option value="Interview">
              Interview
            </option>

            <option value="Hired">
              Hired
            </option>

            <option value="Rejected">
              Rejected
            </option>

          </select>

        </div>

      </div>

      {/* =================================================
          APPLICATION TABLE
      ================================================= */}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              Application Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Showing{" "}
              {filteredApplications.length}{" "}
              application
              {filteredApplications.length !==
              1
                ? "s"
                : ""}
            </p>

          </div>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter(
                "All"
              );
            }}
            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
          >
            Clear Filters
          </button>

        </div>

        {filteredApplications.length ===
        0 ? (
          <div className="p-10 text-center">

            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-2xl">
              <FaFileAlt />
            </div>

            <h3 className="font-semibold text-gray-700 mt-4">
              No applications found
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Try changing your search or status filter.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Candidate
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Job
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Company
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Applied
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {filteredApplications
                  .slice(0, 20)
                  .map(
                    (
                      application
                    ) => (
                      <tr
                        key={
                          application._id
                        }
                        className="hover:bg-gray-50 transition"
                      >

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                              {getCandidateName(
                                application
                              )
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div>

                              <p className="font-semibold text-gray-900">
                                {getCandidateName(
                                  application
                                )}
                              </p>

                              <p className="text-xs text-gray-500">
                                {getCandidateEmail(
                                  application
                                )}
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <FaBriefcase className="text-purple-500" />

                            <span className="text-sm text-gray-700">
                              {getJobTitle(
                                application
                              )}
                            </span>

                          </div>

                        </td>

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <FaBuilding className="text-green-500" />

                            <span className="text-sm text-gray-700">
                              {getCompanyName(
                                application
                              )}
                            </span>

                          </div>

                        </td>

                        <td className="px-5 py-4">

                          <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {application.status ||
                              "Pending"}
                          </span>

                        </td>

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2 text-sm text-gray-600">

                            <FaCalendarAlt className="text-gray-400" />

                            {formatDate(
                              application.createdAt
                            )}

                          </div>

                        </td>

                      </tr>
                    )
                  )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default Reports;

