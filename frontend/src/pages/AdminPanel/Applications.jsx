
import { useEffect, useState } from "react";

import {
  FaFileAlt,
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEye,
  FaSyncAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaEnvelope,
  FaPhone,
  FaDownload,
} from "react-icons/fa";

import API from "../../api/api";

const Applications = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [updatingId, setUpdatingId] = useState(null);

  const [showResumePreview, setShowResumePreview] =
    useState(false);

  // =====================================================
  // FETCH APPLICATIONS
  // =====================================================

  const fetchApplications = async () => {
    try {
      setError("");

      const response = await API.get("/admin/applications");

      const data = response.data;

      setApplications(
        data?.applications ||
          data?.data ||
          []
      );
    } catch (err) {
      console.error(
        "Fetch Applications Error:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return;
      }

      if (err.response?.status === 403) {
        setError(
          "You are not authorized to view applications."
        );

        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load applications."
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);

        await fetchApplications();
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await fetchApplications();
    } finally {
      setRefreshing(false);
    }
  };

  // =====================================================
  // UPDATE APPLICATION STATUS
  // =====================================================

  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      setUpdatingId(applicationId);

      setError("");

      const response = await API.put(
        `/applications/${applicationId}/status`,
        {
          status,
        }
      );

      const updatedApplication =
        response.data?.application;

      setApplications((prev) =>
        prev.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                ...updatedApplication,
              }
            : application
        )
      );

      setSelectedApplication((prev) => {
        if (
          !prev ||
          prev._id !== applicationId
        ) {
          return prev;
        }

        return {
          ...prev,
          ...updatedApplication,
        };
      });
    } catch (err) {
      console.error(
        "Update Application Status Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const getCandidate = (application) => {
    return (
      application?.candidate ||
      application?.user ||
      application?.applicant ||
      {}
    );
  };

  const getJob = (application) => {
    return application?.job || {};
  };

  const getCompany = (application) => {
    const job = getJob(application);

    return (
      job?.company ||
      application?.company ||
      {}
    );
  };

  const getCandidateName = (application) => {
    const candidate =
      getCandidate(application);

    return (
      candidate?.name ||
      candidate?.fullName ||
      "Unknown Candidate"
    );
  };

  const getCandidateEmail = (application) => {
    const candidate =
      getCandidate(application);

    return (
      candidate?.email ||
      "No email"
    );
  };

  const getCandidatePhone = (application) => {
    const candidate =
      getCandidate(application);

    return (
      candidate?.phone ||
      "No phone"
    );
  };

  const getJobTitle = (application) => {
    const job = getJob(application);

    return (
      job?.title ||
      application?.jobTitle ||
      "Unknown Job"
    );
  };

  const getCompanyName = (application) => {
    const company =
      getCompany(application);

    if (typeof company === "string") {
      return company;
    }

    return (
      company?.name ||
      company?.companyName ||
      "Unknown Company"
    );
  };

  const getLocation = (application) => {
    const job = getJob(application);

    return (
      job?.location ||
      application?.location ||
      "Not specified"
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // RESUME URL
  // =====================================================

  const getResumeUrl = (resume) => {
    if (!resume) {
      return "";
    }

    // If resume is an object
    if (typeof resume === "object") {
      resume =
        resume.url ||
        resume.path ||
        resume.filename ||
        resume.file ||
        "";
    }

    if (!resume) {
      return "";
    }

    resume = String(resume);

    // Already full URL
    if (
      resume.startsWith("http://") ||
      resume.startsWith("https://")
    ) {
      return resume;
    }

    // Backend URL
    const apiBaseUrl =
      API.defaults?.baseURL ||
      "http://localhost:5000/api";

    // Remove /api from backend URL
    const backendUrl = apiBaseUrl.replace(
      /\/api\/?$/,
      ""
    );

    // Remove leading slash
    const cleanResume = resume.replace(
      /^\/+/,
      ""
    );

    // If backend already returned uploads/...
    if (
      cleanResume.startsWith("uploads/")
    ) {
      return `${backendUrl}/${cleanResume}`;
    }

    // If backend returned only filename
    return `${backendUrl}/uploads/${cleanResume}`;
  };

  // =====================================================
  // RESUME FILE NAME
  // =====================================================

  const getResumeFileName = (resume) => {
    if (!resume) {
      return "Resume";
    }

    if (typeof resume === "object") {
      resume =
        resume.filename ||
        resume.name ||
        resume.url ||
        resume.path ||
        "Resume";
    }

    return String(resume)
      .split("/")
      .pop()
      .split("?")[0];
  };

  // =====================================================
  // OPEN RESUME PREVIEW
  // =====================================================

  const handleViewResume = (resume) => {
    const resumeUrl = getResumeUrl(resume);

    console.log("Resume original:", resume);
    console.log("Resume URL:", resumeUrl);

    if (!resumeUrl) {
      alert("Resume file is not available.");
      return;
    }

    // Open preview inside modal
    setShowResumePreview(true);
  };

  // =====================================================
  // CLOSE RESUME PREVIEW
  // =====================================================

  const closeResumePreview = () => {
    setShowResumePreview(false);
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Shortlisted":
        return "bg-green-100 text-green-700";

      case "Interview":
        return "bg-blue-100 text-blue-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Reviewed":
        return "bg-purple-100 text-purple-700";

      case "Hired":
        return "bg-emerald-100 text-emerald-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Shortlisted":
        return <FaCheckCircle />;

      case "Interview":
        return <FaCalendarAlt />;

      case "Rejected":
        return <FaTimesCircle />;

      case "Reviewed":
        return <FaEye />;

      case "Hired":
        return <FaCheckCircle />;

      default:
        return <FaClock />;
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredApplications =
    applications.filter((application) => {
      const candidateName =
        getCandidateName(application)
          .toLowerCase();

      const email =
        getCandidateEmail(application)
          .toLowerCase();

      const jobTitle =
        getJobTitle(application)
          .toLowerCase();

      const company =
        getCompanyName(application)
          .toLowerCase();

      const searchText =
        search.toLowerCase();

      return (
        candidateName.includes(searchText) ||
        email.includes(searchText) ||
        jobTitle.includes(searchText) ||
        company.includes(searchText)
      );
    });

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">

          <FaSyncAlt className="text-3xl text-purple-600 animate-spin" />

          <p>
            Loading applications...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="max-w-7xl mx-auto">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-7">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <FaFileAlt />
            </div>

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Applications
              </h1>

              <p className="text-gray-500 mt-1">
                Manage all job applications.
              </p>

            </div>

          </div>

        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 disabled:bg-purple-300 text-white px-5 py-3 rounded-lg transition font-medium"
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

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        {/* TOTAL */}

        <div className="bg-white rounded-xl shadow-lg p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Total Applications
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {applications.length}
              </h2>

            </div>

            <div className="w-11 h-11 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <FaFileAlt />
            </div>

          </div>

        </div>

        {/* SHORTLISTED */}

        <div className="bg-white rounded-xl shadow-lg p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Shortlisted
              </p>

              <h2 className="text-2xl font-bold text-green-600 mt-1">
                {
                  applications.filter(
                    (item) =>
                      item.status ===
                      "Shortlisted"
                  ).length
                }
              </h2>

            </div>

            <div className="w-11 h-11 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <FaCheckCircle />
            </div>

          </div>

        </div>

        {/* INTERVIEWS */}

        <div className="bg-white rounded-xl shadow-lg p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Interviews
              </p>

              <h2 className="text-2xl font-bold text-blue-600 mt-1">
                {
                  applications.filter(
                    (item) =>
                      item.status ===
                      "Interview"
                  ).length
                }
              </h2>

            </div>

            <div className="w-11 h-11 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FaCalendarAlt />
            </div>

          </div>

        </div>

        {/* REJECTED */}

        <div className="bg-white rounded-xl shadow-lg p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Rejected
              </p>

              <h2 className="text-2xl font-bold text-red-600 mt-1">
                {
                  applications.filter(
                    (item) =>
                      item.status ===
                      "Rejected"
                  ).length
                }
              </h2>

            </div>

            <div className="w-11 h-11 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <FaTimesCircle />
            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="bg-white rounded-xl shadow-lg p-5 mb-6">

        <div className="relative">

          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search candidate, email, job or company..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
          />

        </div>

      </div>

      {/* =================================================
          APPLICATIONS TABLE
      ================================================= */}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <div className="p-5 border-b flex items-center justify-between">

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              All Applications
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {filteredApplications.length} application
              {filteredApplications.length !== 1
                ? "s"
                : ""}
            </p>

          </div>

        </div>

        {filteredApplications.length === 0 ? (

          <div className="p-12 text-center">

            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-2xl">
              <FaFileAlt />
            </div>

            <h3 className="font-semibold text-gray-700 mt-4">
              No applications found
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Applications submitted by candidates
              will appear here.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

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
                    Applied
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="text-right px-5 py-4 text-sm font-semibold text-gray-600">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {filteredApplications.map(
                  (application) => {

                    return (

                      <tr
                        key={
                          application._id
                        }
                        className="hover:bg-gray-50 transition"
                      >

                        {/* CANDIDATE */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">

                              {getCandidateName(
                                application
                              )
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <div className="min-w-0">

                              <p className="font-semibold text-gray-900 truncate max-w-[180px]">
                                {getCandidateName(
                                  application
                                )}
                              </p>

                              <p className="text-xs text-gray-500 truncate max-w-[180px]">
                                {getCandidateEmail(
                                  application
                                )}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* JOB */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <FaBriefcase className="text-purple-500 shrink-0" />

                            <span className="text-sm font-medium text-gray-800">
                              {getJobTitle(
                                application
                              )}
                            </span>

                          </div>

                        </td>

                        {/* COMPANY */}

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

                        {/* DATE */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2 text-sm text-gray-600">

                            <FaCalendarAlt className="text-gray-400" />

                            {formatDate(
                              application.createdAt
                            )}

                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(
                                application.status
                              )}`}
                            >

                              {getStatusIcon(
                                application.status
                              )}

                              {application.status ||
                                "Pending"}

                            </span>

                          </div>

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedApplication(
                                  application
                                )
                              }
                              className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white flex items-center justify-center transition"
                              title="View Application"
                            >
                              <FaEye />
                            </button>

                          </div>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =================================================
          APPLICATION DETAILS MODAL
      ================================================= */}

      {selectedApplication && (

        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() =>
            setSelectedApplication(null)
          }
        >

          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="p-6 border-b flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FaFileAlt />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-900">
                    Application Details
                  </h2>

                  <p className="text-sm text-gray-500">
                    Review candidate application
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedApplication(null)
                }
                className="w-9 h-9 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white transition text-xl"
              >
                ×
              </button>

            </div>

            {/* BODY */}

            <div className="p-6 space-y-6">

              {/* =================================================
                  CANDIDATE
              ================================================= */}

              <div>

                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Candidate
                </h3>

                <div className="bg-gray-50 rounded-xl p-4">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold">

                      {getCandidateName(
                        selectedApplication
                      )
                        .charAt(0)
                        .toUpperCase()}

                    </div>

                    <div>

                      <h4 className="font-bold text-gray-900">
                        {getCandidateName(
                          selectedApplication
                        )}
                      </h4>

                      <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <FaEnvelope />

                        {getCandidateEmail(
                          selectedApplication
                        )}
                      </p>

                      <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <FaPhone />

                        {getCandidatePhone(
                          selectedApplication
                        )}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  JOB INFORMATION
              ================================================= */}

              <div>

                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Job Information
                </h3>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">

                  <div className="flex items-center gap-3">

                    <FaBriefcase className="text-purple-500" />

                    <span className="font-medium text-gray-800">
                      {getJobTitle(
                        selectedApplication
                      )}
                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <FaBuilding className="text-green-500" />

                    <span className="text-gray-700">
                      {getCompanyName(
                        selectedApplication
                      )}
                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <FaMapMarkerAlt className="text-red-500" />

                    <span className="text-gray-700">
                      {getLocation(
                        selectedApplication
                      )}
                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <FaCalendarAlt className="text-blue-500" />

                    <span className="text-gray-700">
                      Applied on{" "}
                      {formatDate(
                        selectedApplication.createdAt
                      )}
                    </span>

                  </div>

                </div>

              </div>

              {/* =================================================
                  COVER LETTER
              ================================================= */}

              <div>

                <div className="flex items-center justify-between mb-3">

                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Cover Letter
                  </h3>

                  <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                    Candidate Message
                  </span>

                </div>

                {selectedApplication.coverLetter ? (

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">

                    <div className="flex items-start gap-3">

                      <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <FaFileAlt />
                      </div>

                      <div className="flex-1">

                        <p className="text-sm font-semibold text-gray-900 mb-2">
                          Cover Letter
                        </p>

                        <p className="text-sm text-gray-700 leading-7 whitespace-pre-line break-words">
                          {
                            selectedApplication.coverLetter
                          }
                        </p>

                      </div>

                    </div>

                  </div>

                ) : (

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-500">
                    No cover letter was provided by the candidate.
                  </div>

                )}

              </div>

              {/* =================================================
                  RESUME
              ================================================= */}

              <div>

                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Resume
                </h3>

                {selectedApplication.resume ? (

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-11 h-11 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                          <FaFileAlt />
                        </div>

                        <div className="min-w-0">

                          <p className="font-semibold text-gray-900">
                            Candidate Resume
                          </p>

                          <p className="text-xs text-gray-500 mt-1 break-all">
                            {getResumeFileName(
                              selectedApplication.resume
                            )}
                          </p>

                        </div>

                      </div>

                      <div className="flex flex-wrap gap-2">

                        {/* VIEW */}

                        <button
                          type="button"
                          onClick={() =>
                            handleViewResume(
                              selectedApplication.resume
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition font-medium"
                        >
                          <FaEye />
                          View Resume
                        </button>

                        {/* DOWNLOAD */}

                        <a
                          href={getResumeUrl(
                            selectedApplication.resume
                          )}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-3 rounded-lg transition font-medium"
                        >
                          <FaDownload />
                          Download
                        </a>

                      </div>

                    </div>

                  </div>

                ) : (

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-500">
                    No resume was provided by the candidate.
                  </div>

                )}

              </div>

              {/* =================================================
                  STATUS
              ================================================= */}

              <div>

                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Application Status
                </h3>

                <div className="flex flex-wrap gap-3">

                  {[
                    "Pending",
                    "Reviewed",
                    "Shortlisted",
                    "Interview",
                    "Hired",
                    "Rejected",
                  ].map(
                    (status) => (

                      <button
                        key={status}
                        type="button"
                        disabled={
                          updatingId ===
                          selectedApplication._id
                        }
                        onClick={() =>
                          updateStatus(
                            selectedApplication._id,
                            status
                          )
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          selectedApplication.status ===
                          status
                            ? getStatusStyle(
                                status
                              )
                            : "bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600"
                        } disabled:opacity-50`}
                      >

                        {updatingId ===
                          selectedApplication._id &&
                        selectedApplication.status ===
                          status ? (
                          <FaSyncAlt className="animate-spin inline mr-2" />
                        ) : null}

                        {status}

                      </button>

                    )
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* =================================================
          RESUME PREVIEW MODAL
      ================================================= */}

      {showResumePreview &&
        selectedApplication?.resume && (

        <div
          className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-3 sm:p-5"
          onClick={closeResumePreview}
        >

          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* RESUME HEADER */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b bg-white">

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <FaFileAlt />
                </div>

                <div className="min-w-0">

                  <h2 className="font-bold text-gray-900">
                    Candidate Resume
                  </h2>

                  <p className="text-xs text-gray-500 truncate max-w-[300px]">
                    {getResumeFileName(
                      selectedApplication.resume
                    )}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

                {/* DOWNLOAD */}

                <a
                  href={getResumeUrl(
                    selectedApplication.resume
                  )}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  <FaDownload />
                  Download
                </a>

                {/* CLOSE */}

                <button
                  type="button"
                  onClick={
                    closeResumePreview
                  }
                  className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white transition text-xl"
                >
                  ×
                </button>

              </div>

            </div>

            {/* PDF PREVIEW */}

            <div className="flex-1 bg-gray-100 p-2 sm:p-3">

              <iframe
                src={getResumeUrl(
                  selectedApplication.resume
                )}
                title="Candidate Resume"
                className="w-full h-full rounded-lg border border-gray-200 bg-white"
              />

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Applications;

