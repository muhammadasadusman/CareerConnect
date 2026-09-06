import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaUsers,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaBriefcase,
} from "react-icons/fa";

import API from "../../api/api";

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  // ==========================================
  // Fetch Interviews
  // ==========================================


  const fetchInterviews = async () => {
    console.log("🔥🔥🔥 FETCH INTERVIEWS FUNCTION CALLED 🔥🔥🔥");
    try {
      setLoading(true);
      setError("");

     const response = await API.get(
  "/interviews/recruiter"
);

console.log(
  "🔥🔥 INTERVIEWS RESPONSE:",
  response.data
);

console.log(
  "🔥🔥 FIRST INTERVIEW:",
  response.data.interviews?.[0]
);

console.log(
  "🔥🔥 COMPANY:",
  response.data.interviews?.[0]?.job?.company
);

setInterviews(
  response.data.interviews || []
);
    } catch (err) {
      console.error(
        "Fetch Interviews Error:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load interviews."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    fetchInterviews();
  }, []);

  // ==========================================
  // Update Interview Status
  // ==========================================

  const updateStatus = async (
    interviewId,
    status
  ) => {
    try {
      setUpdatingId(interviewId);

      const response = await API.put(
        `/interviews/${interviewId}/status`,
        {
          status,
        }
      );

      const updatedInterview =
        response.data.interview;

      setInterviews((prev) =>
        prev.map((interview) =>
          interview._id === interviewId
            ? {
                ...interview,
                ...updatedInterview,
              }
            : interview
        )
      );
    } catch (err) {
      console.error(
        "Interview Status Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update interview."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // Cancel Interview
  // ==========================================

  const cancelInterview = async (
    interviewId
  ) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this interview?"
    );

    if (!confirmCancel) return;

    try {
      setUpdatingId(interviewId);

      await API.put(
        `/interviews/${interviewId}/cancel`
      );

      setInterviews((prev) =>
        prev.map((interview) =>
          interview._id === interviewId
            ? {
                ...interview,
                status: "Cancelled",
              }
            : interview
        )
      );
    } catch (err) {
      console.error(
        "Cancel Interview Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to cancel interview."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // Format Date
  // ==========================================

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

  // ==========================================
  // Status Style
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-green-100 text-green-700";

      case "Completed":
        return "bg-blue-100 text-blue-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">

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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="bg-white rounded-xl shadow-lg p-10 text-center">

            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>

            <p className="text-gray-500 mt-4">
              Loading interviews...
            </p>

          </div>

        </main>

      </div>
    );
  }

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

        <div className="mb-8">

          <p className="text-sm text-purple-600 font-medium">
            EMPLOYER PANEL
          </p>

          <div className="flex items-center gap-3 mt-1">

            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
              <FaCalendarAlt />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Interviews
            </h1>

          </div>

          <p className="text-gray-500 mt-2">
            Manage and track interviews with your candidates.
          </p>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* ==========================================
            Empty State
        ========================================== */}

        {interviews.length === 0 && !error && (

          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl">
              <FaCalendarAlt />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6">
              No Interviews Scheduled
            </h2>

            <p className="text-gray-500 max-w-md mx-auto mt-2">
              You currently don't have any scheduled interviews.
              Interviews with shortlisted candidates will appear here.
            </p>

            <Link
              to="/employer-dashboard"
              className="inline-flex items-center justify-center gap-2 mt-6 bg-purple-600 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg transition"
            >
              <FaUsers />
              Back to Dashboard
            </Link>

          </div>

        )}

        {/* ==========================================
            Interviews List
        ========================================== */}

        {interviews.length > 0 && (

          <div className="space-y-5">

            {interviews.map((interview) => {

              const candidate =
                interview.candidate || {};

              const job =
                interview.job || {};

              return (

                <div
                  key={interview._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >

                  {/* Top */}

                  <div className="p-5 sm:p-6">

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                      {/* Candidate */}

                      <div className="flex items-start gap-4 min-w-0">

                       <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">

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
          "INTERVIEW COMPANY LOGO FAILED:",
          `http://localhost:5000${job.company.logo}`
        );

        e.currentTarget.style.display = "none";

        const fallback =
          e.currentTarget.parentElement.querySelector(
            ".interview-logo-fallback"
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
    className={`interview-logo-fallback ${
      job?.company?.logo ? "hidden" : "flex"
    } w-full h-full items-center justify-center bg-purple-100 text-purple-600 text-xl`}
  >
    <FaBriefcase />
  </div>

</div>

                        <div className="min-w-0">

                          <h2 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                            {candidate.name ||
                              "Candidate"}
                          </h2>

                          <p className="text-sm text-gray-500 mt-1 break-all">
                            {candidate.email ||
                              "No email"}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-2">

                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                              <FaBriefcase className="text-purple-500" />
                              {job.title ||
                                "Job"}
                            </span>

                          </div>

                        </div>

                      </div>

                      {/* Status */}

                      <span
                        className={`self-start inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(
                          interview.status
                        )}`}
                      >
                        {interview.status}
                      </span>

                    </div>

                    {/* ==================================
                        Interview Details
                    ================================== */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t">

                      {/* Date */}

                      <div className="bg-gray-50 rounded-lg p-4">

                        <div className="flex items-center gap-2 text-purple-600">

                          <FaCalendarAlt />

                          <span className="text-xs font-medium text-gray-500">
                            Date
                          </span>

                        </div>

                        <p className="font-semibold text-gray-900 mt-2">
                          {formatDate(
                            interview.date
                          )}
                        </p>

                      </div>

                      {/* Time */}

                      <div className="bg-gray-50 rounded-lg p-4">

                        <div className="flex items-center gap-2 text-blue-600">

                          <FaClock />

                          <span className="text-xs font-medium text-gray-500">
                            Time
                          </span>

                        </div>

                        <p className="font-semibold text-gray-900 mt-2">
                          {interview.time ||
                            "N/A"}
                        </p>

                      </div>

                      {/* Type */}

                      <div className="bg-gray-50 rounded-lg p-4">

                        <div className="flex items-center gap-2 text-green-600">

                          <FaVideo />

                          <span className="text-xs font-medium text-gray-500">
                            Type
                          </span>

                        </div>

                        <p className="font-semibold text-gray-900 mt-2">
                          {interview.type ||
                            "Online"}
                        </p>

                      </div>

                      {/* Location */}

                      <div className="bg-gray-50 rounded-lg p-4">

                        <div className="flex items-center gap-2 text-orange-600">

                          <FaMapMarkerAlt />

                          <span className="text-xs font-medium text-gray-500">
                            Location
                          </span>

                        </div>

                        <p className="font-semibold text-gray-900 mt-2 break-words">
                          {interview.type ===
                          "Online"
                            ? "Online Meeting"
                            : interview.location ||
                              "Not specified"}
                        </p>

                      </div>

                    </div>

                    {/* Meeting Link */}

                    {interview.meetingLink && (
                      <div className="mt-5">

                        <a
                          href={
                            interview.meetingLink
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
                        >
                          <FaVideo />
                          Join Meeting
                        </a>

                      </div>
                    )}

                    {/* Notes */}

                    {interview.notes && (

                      <div className="mt-5 bg-gray-50 rounded-lg p-4">

                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Notes
                        </p>

                        <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                          {interview.notes}
                        </p>

                      </div>

                    )}

                    {/* ==================================
                        Actions
                    ================================== */}

                    {interview.status ===
                      "Scheduled" && (

                      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t">

                        <button
                          type="button"
                          disabled={
                            updatingId ===
                            interview._id
                          }
                          onClick={() =>
                            updateStatus(
                              interview._id,
                              "Completed"
                            )
                          }
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
                        >
                          <FaCheckCircle />

                          {updatingId ===
                          interview._id
                            ? "Updating..."
                            : "Mark Completed"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            updatingId ===
                            interview._id
                          }
                          onClick={() =>
                            cancelInterview(
                              interview._id
                            )
                          }
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
                        >
                          <FaTimesCircle />

                          {updatingId ===
                          interview._id
                            ? "Updating..."
                            : "Cancel Interview"}
                        </button>

                      </div>

                    )}

                  </div>

                </div>

              );
            })}

          </div>

        )}

        {/* Back */}

        <div className="mt-8">

          <Link
            to="/employer-dashboard"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium"
          >
            <FaArrowLeft />
            Back to Recruiter Dashboard
          </Link>

        </div>

      </main>

    </div>
  );
};

export default Interviews;