import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaFileAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaTimes,
  FaEye,
  FaTrash,
  FaComments,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import API from "../../api/api";

const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ==========================
  // Fetch Applications
  // ==========================
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/applications/my-applications"
      );

      setApplications(response.data.applications || []);
    } catch (err) {
      console.error("Applications Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // ==========================
  // Delete Application
  // ==========================
  const handleDelete = async (applicationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(applicationId);

      await API.delete(
        `/applications/${applicationId}`
      );

      setApplications((prev) =>
        prev.filter(
          (application) =>
            application._id !== applicationId
        )
      );

      alert("Application deleted successfully.");
    } catch (err) {
      console.error("Delete Application Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to delete application."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================
  // Status Style
  // ==========================
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

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ==========================
  // Status Icon
  // ==========================
  const getStatusIcon = (status) => {
    switch (status) {
      case "Shortlisted":
        return "✓";

      case "Interview":
        return <FaCalendarAlt />;

      case "Rejected":
        return <FaTimes />;

      case "Reviewed":
        return <FaEye />;

      default:
        return <FaClock />;
    }
  };

  // ==========================
  // Format Date
  // ==========================
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

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ==========================
          Header
      ========================== */}
      <header className="bg-[#070B2B] text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="min-h-20 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <Link to="/candidate-dashboard">

              <h1 className="text-2xl sm:text-3xl font-bold">
                Career
                <span className="text-purple-500">
                  Connect
                </span>
              </h1>

            </Link>

            <Link
              to="/candidate-dashboard"
              className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-purple-400 transition"
            >
              <FaArrowLeft />
              Dashboard
            </Link>

          </div>

        </div>

      </header>


      {/* ==========================
          Main
      ========================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">

          <div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Applications
            </h1>

            <p className="text-gray-500 mt-2">
              Track all the jobs you have applied for.
            </p>

          </div>

          {!loading && !error && (
            <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium">
              {applications.length}{" "}
              {applications.length === 1
                ? "Application"
                : "Applications"}
            </div>
          )}

        </div>


        {/* ==========================
            Loading
        ========================== */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">

            <div className="w-11 h-11 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>

            <p className="text-gray-500 mt-4">
              Loading your applications...
            </p>

          </div>
        )}


        {/* ==========================
            Error
        ========================== */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">

            <div className="w-14 h-14 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto text-xl">
              <FaTimes />
            </div>

            <h2 className="text-lg font-bold text-red-700 mt-4">
              Unable to Load Applications
            </h2>

            <p className="text-red-600 mt-2">
              {error}
            </p>

            <button
              onClick={fetchApplications}
              className="mt-5 bg-purple-600 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg transition"
            >
              Try Again
            </button>

          </div>
        )}


        {/* ==========================
            No Applications
        ========================== */}
        {!loading &&
          !error &&
          applications.length === 0 && (

            <div className="bg-white rounded-xl shadow-lg p-10 sm:p-14 text-center">

              <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                <FaFileAlt />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6">
                No Applications Yet
              </h2>

              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                You haven't applied for any jobs yet.
                Start exploring available opportunities
                and apply for your dream job.
              </p>

              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 mt-6 bg-purple-600 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition"
              >
                <FaBriefcase />
                Browse Jobs
              </Link>

            </div>
          )}


        {/* ==========================
            Applications
        ========================== */}
        {!loading &&
          !error &&
          applications.length > 0 && (

            <div className="space-y-6">

              {applications.map((application) => {

                const job = application.job || {};

                return (
                  <div
                    key={application._id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden"
                  >

                    {/* ==========================
                        Application Header
                    ========================== */}
                    <div className="p-5 sm:p-6">

                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                        {/* Job Info */}
                        <div className="flex items-start gap-4">

                          

<div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden">

  {job?.company?.logo ? (
    <img
      src={
        job.company.logo.startsWith("http")
          ? job.company.logo.replace(/^http:\/\//, "https://")
          : `https://careerconnect.dockhosting.dev${job.company.logo}`
      }
      alt={job?.company?.name || "Company"}
      className="w-full h-full object-contain p-2"
      onError={(e) => {
        console.error(
          "MY APPLICATIONS LOGO FAILED:",
          e.currentTarget.src
        );

        e.currentTarget.style.display = "none";

        const fallback =
          e.currentTarget.parentElement.querySelector(
            ".my-application-logo-fallback"
          );

        if (fallback) {
          fallback.classList.remove("hidden");
          fallback.classList.add("flex");
        }
      }}
    />
  ) : null}

  <div
    className={`my-application-logo-fallback ${
      job?.company?.logo ? "hidden" : "flex"
    } w-full h-full items-center justify-center bg-purple-100 text-purple-600 text-xl sm:text-2xl`}
  >
    <FaBriefcase />
  </div>

</div>
                          


                          <div className="min-w-0">

                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                              {job.title || "Job Title"}
                            </h2>

                            <p className="text-gray-600 mt-1">
                              {job.company?.name ||
                                "Company"}
                            </p>

                            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">

                              {job.location && (
                                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                  <FaMapMarkerAlt className="text-purple-500" />
                                  {job.location}
                                </span>
                              )}

                              {job.salary && (
                                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                  <FaMoneyBillWave className="text-green-500" />
                                  {job.salary}
                                </span>
                              )}

                              {job.jobType && (
                                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                  <FaBriefcase className="text-purple-500" />
                                  {job.jobType}
                                </span>
                              )}

                            </div>

                          </div>

                        </div>


                        {/* Status */}
                        <div className="flex flex-col items-start lg:items-end gap-2">

                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(
                              application.status
                            )}`}
                          >

                            {getStatusIcon(
                              application.status
                            )}

                            {application.status ||
                              "Applied"}

                          </span>

                          <p className="text-xs text-gray-400">
                            Applied on{" "}
                            {formatDate(
                              application.createdAt
                            )}
                          </p>

                        </div>

                      </div>


                      {/* ==========================
                          Job Tags
                      ========================== */}
                      <div className="flex flex-wrap gap-2 mt-5">

                        {job.category && (
                          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-medium">
                            {job.category}
                          </span>
                        )}

                        {job.experience && (
                          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                            {job.experience}
                          </span>
                        )}

                        {job.deadline && (
                          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-medium">
                            <FaCalendarAlt />
                            Deadline:{" "}
                            {formatDate(
                              job.deadline
                            )}
                          </span>
                        )}

                      </div>

                    </div>


                    {/* ==========================
                        Cover Letter
                    ========================== */}
                    {application.coverLetter && (
                      <div className="mx-5 sm:mx-6 mb-5 sm:mb-6 p-4 bg-gray-50 rounded-lg">

                        <h3 className="text-sm font-semibold text-gray-900">
                          Cover Letter
                        </h3>

                        <p className="text-sm text-gray-600 mt-2 leading-6">
                          {application.coverLetter}
                        </p>

                      </div>
                    )}


                    {/* ==========================
                        Footer
                    ========================== */}
                    <div className="border-t bg-gray-50 px-5 sm:px-6 py-4">

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        {/* Resume */}
                        <div>

                          {application.resume && (
                            <span className="inline-flex items-center gap-2 text-sm text-gray-600">

                              <FaFileAlt className="text-purple-500" />

                              <span>
                                Resume:{" "}
                                <strong className="font-medium text-gray-700">
                                  {application.resume}
                                </strong>
                              </span>

                            </span>
                          )}

                        </div>


                        {/* Buttons */}
<div className="flex flex-col sm:flex-row gap-2">

  {/* View Job */}
  {job._id && (
    <Link
      to={`/jobs/${job._id}`}
      className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-lg text-sm transition"
    >
      <FaEye />
      View Job
    </Link>
  )}

  {/* Message Recruiter */}
  {job.postedBy?._id && (
    <Link
      to={`/candidate/messages/${job.postedBy._id}`}
      className="inline-flex items-center justify-center gap-2 bg-[#070B2B] hover:bg-purple-600 text-white px-4 py-2.5 rounded-lg text-sm transition"
    >
      <FaComments />
      Message Recruiter
    </Link>
  )}

  {/* Delete */}
  <button
    type="button"
    onClick={() =>
      handleDelete(application._id)
    }
    disabled={
      deletingId === application._id
    }
    className="inline-flex items-center justify-center gap-2 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2.5 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <FaTrash />

    {deletingId === application._id
      ? "Deleting..."
      : "Delete"}
  </button>

</div>


                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}


        {/* ==========================
            Bottom Navigation
        ========================== */}
        {!loading && !error && (
          <div className="flex flex-col sm:flex-row gap-3 mt-8">

            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg transition"
            >
              <FaBriefcase />
              Browse More Jobs
            </Link>

            <Link
              to="/candidate-dashboard"
              className="inline-flex items-center justify-center gap-2 border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-5 py-3 rounded-lg transition"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>

          </div>
        )}

      </main>

    </div>
  );
};

export default CandidateApplications;