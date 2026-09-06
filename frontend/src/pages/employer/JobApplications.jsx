import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaBriefcase,
  FaEnvelope,
  FaFileAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhone,
  FaTimes,
  FaUser,
  FaUserCheck,
  FaCalendarAlt,
  FaClock,
  FaVideo,
} from "react-icons/fa";

import API from "../../api/api";

const JobApplications = () => {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  // ==========================================
  // Interview Modal
  // ==========================================

  const [showInterviewModal, setShowInterviewModal] =
    useState(false);

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [interviewLoading, setInterviewLoading] =
    useState(false);

  const [interviewError, setInterviewError] =
    useState("");

  const [interviewForm, setInterviewForm] = useState({
    date: "",
    time: "",
    type: "Online",
    meetingLink: "",
    location: "",
    notes: "",
  });

  // ==========================================
  // Fetch Applications
  // ==========================================

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          `/applications/job/${jobId}`
        );

        const fetchedApplications =
          response.data.applications || [];

        setApplications(fetchedApplications);

        // Job information from first application
        if (fetchedApplications.length > 0) {
          setJob(
            fetchedApplications[0].job || null
          );
        }
      } catch (err) {
        console.error(
          "Applications Error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load applications."
        );
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  // ==========================================
  // Update Application Status
  // ==========================================

  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      setUpdatingId(applicationId);

      const response = await API.put(
        `/applications/${applicationId}/status`,
        {
          status,
        }
      );

      const updatedApplication =
        response.data.application;

      setApplications((prev) =>
        prev.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                ...updatedApplication,
                candidate:
                  application.candidate,
                job: application.job,
              }
            : application
        )
      );
    } catch (err) {
      console.error(
        "Status Update Error:",
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

  // ==========================================
  // Open Interview Modal
  // ==========================================

  const openInterviewModal = (
    application
  ) => {
    setSelectedApplication(application);

    setInterviewError("");

    setInterviewForm({
      date: "",
      time: "",
      type: "Online",
      meetingLink: "",
      location: "",
      notes: "",
    });

    setShowInterviewModal(true);
  };

  // ==========================================
  // Close Interview Modal
  // ==========================================

  const closeInterviewModal = () => {
    if (interviewLoading) return;

    setShowInterviewModal(false);
    setSelectedApplication(null);
    setInterviewError("");

    setInterviewForm({
      date: "",
      time: "",
      type: "Online",
      meetingLink: "",
      location: "",
      notes: "",
    });
  };

  // ==========================================
  // Interview Input Change
  // ==========================================

  const handleInterviewChange = (e) => {
    const { name, value } = e.target;

    setInterviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Schedule Interview
  // ==========================================

  const scheduleInterview = async (e) => {
    e.preventDefault();

    if (!selectedApplication) {
      return;
    }

    try {
      setInterviewLoading(true);
      setInterviewError("");

      // Basic validation
      if (
        !interviewForm.date ||
        !interviewForm.time
      ) {
        setInterviewError(
          "Interview date and time are required."
        );

        setInterviewLoading(false);
        return;
      }

      if (
        interviewForm.type === "Online" &&
        !interviewForm.meetingLink
      ) {
        setInterviewError(
          "Please enter the meeting link."
        );

        setInterviewLoading(false);
        return;
      }

      if (
        interviewForm.type === "In-Person" &&
        !interviewForm.location
      ) {
        setInterviewError(
          "Please enter the interview location."
        );

        setInterviewLoading(false);
        return;
      }

      // ==========================================
      // POST Interview
      // ==========================================

      const response = await API.post(
        "/interviews",
        {
          application:
            selectedApplication._id,

          date: interviewForm.date,

          time: interviewForm.time,

          type: interviewForm.type,

          meetingLink:
            interviewForm.type === "Online"
              ? interviewForm.meetingLink
              : "",

          location:
            interviewForm.type === "In-Person"
              ? interviewForm.location
              : "",

          notes: interviewForm.notes,
        }
      );

      console.log(
        "INTERVIEW SCHEDULED:",
        response.data
      );

      // ==========================================
      // Update Application Locally
      // Backend already changes status to Interview
      // ==========================================

      setApplications((prev) =>
        prev.map((application) =>
          application._id ===
          selectedApplication._id
            ? {
                ...application,
                status: "Interview",
              }
            : application
        )
      );

      alert(
        "Interview scheduled successfully!"
      );

      closeInterviewModal();
    } catch (err) {
      console.error(
        "Schedule Interview Error:",
        err
      );

      setInterviewError(
        err.response?.data?.message ||
          "Failed to schedule interview."
      );
    } finally {
      setInterviewLoading(false);
    }
  };

  // ==========================================
  // Status Style
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Shortlisted":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Reviewed":
        return "bg-blue-100 text-blue-700";

      case "Interview":
        return "bg-purple-100 text-purple-700";

      case "Hired":
        return "bg-green-100 text-green-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">

        <header className="bg-[#070B2B] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="h-20 flex items-center justify-between">

              <h1 className="text-2xl font-bold">
                Career
                <span className="text-purple-500">
                  Connect
                </span>
              </h1>

              <Link
                to="/employer-dashboard"
                className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition"
              >
                <FaArrowLeft />
                <span className="hidden sm:inline">
                  Dashboard
                </span>
              </Link>

            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-16">

          <div className="bg-white rounded-xl shadow-lg p-10 text-center">

            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>

            <p className="text-gray-500 mt-4">
              Loading applications...
            </p>

          </div>

        </main>

      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">

        <header className="bg-[#070B2B] text-white">

          <div className="max-w-7xl mx-auto px-4 sm:px-6">

            <div className="h-20 flex items-center justify-between">

              <h1 className="text-2xl font-bold">
                Career
                <span className="text-purple-500">
                  Connect
                </span>
              </h1>

              <Link
                to="/employer-dashboard"
                className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition"
              >
                <FaArrowLeft />
                <span className="hidden sm:inline">
                  Dashboard
                </span>
              </Link>

            </div>

          </div>

        </header>

        <main className="max-w-4xl mx-auto px-4 py-16">

          <div className="bg-white rounded-xl shadow-lg p-10 text-center">

            <FaBriefcase className="text-5xl text-red-300 mx-auto" />

            <h2 className="text-2xl font-bold text-gray-900 mt-5">
              Unable to Load Applications
            </h2>

            <p className="text-gray-500 mt-2">
              {error}
            </p>

            <Link
              to="/employer-dashboard"
              className="inline-flex items-center gap-2 mt-6 bg-purple-600 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ======================================
          Header
      ====================================== */}

      <header className="bg-[#070B2B] text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="min-h-20 py-4 flex items-center justify-between gap-4">

            <h1 className="text-2xl sm:text-3xl font-bold">
              Career
              <span className="text-purple-500">
                Connect
              </span>
            </h1>

            <Link
              to="/employer-dashboard"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-purple-400 transition shrink-0"
            >
              <FaArrowLeft />

              <span className="hidden sm:inline">
                Dashboard
              </span>
            </Link>

          </div>

        </div>

      </header>


      {/* ======================================
          Main
      ====================================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Heading */}

        <div className="mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <p className="text-sm text-purple-600 font-medium">
                RECRUITER
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                Job Applications
              </h1>

              <p className="text-gray-500 mt-2">
                Review and manage candidates who applied for this job.
              </p>

            </div>

            <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium self-start sm:self-auto">
              {applications.length}{" "}
              {applications.length === 1
                ? "Applicant"
                : "Applicants"}
            </div>

          </div>

        </div>


        {/* ======================================
            Job Summary
        ====================================== */}

        {job && (
          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 mb-6">

            <div className="flex items-start gap-4">

              {/* Company Logo */}
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
          "JOB APPLICATIONS LOGO FAILED:",
          `http://localhost:5000${job.company.logo}`
        );

        e.currentTarget.style.display = "none";

        const fallback =
          e.currentTarget.parentElement.querySelector(
            ".company-logo-fallback"
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
    className={`company-logo-fallback ${
      job?.company?.logo ? "hidden" : "flex"
    } w-full h-full items-center justify-center bg-purple-100 text-purple-600 text-xl`}
  >
    <FaBriefcase />
  </div>
</div>

              <div className="min-w-0">

                <h2 className="text-xl font-bold text-gray-900 break-words">
                  {job.title}
                </h2>

                <div className="flex flex-wrap gap-4 mt-2">

                  {job.location && (
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <FaMapMarkerAlt className="text-purple-500 shrink-0" />
                      {job.location}
                    </span>
                  )}

                  {job.salary && (
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <FaMoneyBillWave className="text-green-500 shrink-0" />
                      {job.salary}
                    </span>
                  )}

                  {job.jobType && (
                    <span className="text-sm text-gray-500">
                      {job.jobType}
                    </span>
                  )}

                </div>

              </div>

            </div>

          </div>
        )}


        {/* ======================================
            No Applications
        ====================================== */}

        {applications.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">

            <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              <FaUsersIcon />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-5">
              No Applications Yet
            </h2>

            <p className="text-gray-500 mt-2">
              No candidates have applied for this job yet.
            </p>

            <Link
              to="/employer-dashboard"
              className="inline-flex items-center gap-2 mt-6 bg-purple-600 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>

          </div>
        )}


        {/* ======================================
            Applications
        ====================================== */}

        {applications.length > 0 && (
          <div className="space-y-6">

            {applications.map(
              (application) => {

                const candidate =
                  application.candidate || {};

                return (
                  <div
                    key={application._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >

                    {/* Candidate Header */}

                    <div className="p-5 sm:p-6">

                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                        <div className="flex items-start gap-4 min-w-0">

                          {/* Avatar */}

                          <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-lg font-bold shrink-0">

                            {candidate.name
                              ?.split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0)
                              )
                              .join("")
                              .slice(0, 2)
                              .toUpperCase() ||
                              "C"}

                          </div>


                          {/* Candidate Info */}

                          <div className="min-w-0">

                            <h2 className="text-xl font-bold text-gray-900 break-words">
                              {candidate.name ||
                                "Candidate"}
                            </h2>

                            <div className="flex flex-col gap-2 mt-2">

                              {candidate.email && (
                                <span className="flex items-start gap-2 text-sm text-gray-500 break-all">
                                  <FaEnvelope className="text-purple-500 mt-0.5 shrink-0" />
                                  {candidate.email}
                                </span>
                              )}

                              {candidate.phone && (
                                <span className="flex items-start gap-2 text-sm text-gray-500">
                                  <FaPhone className="text-purple-500 mt-0.5 shrink-0" />
                                  {candidate.phone}
                                </span>
                              )}

                              {candidate.location && (
                                <span className="flex items-start gap-2 text-sm text-gray-500">
                                  <FaMapMarkerAlt className="text-purple-500 mt-0.5 shrink-0" />
                                  {candidate.location}
                                </span>
                              )}

                            </div>

                          </div>

                        </div>


                        {/* Status */}

                        <span
                          className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium self-start ${getStatusStyle(
                            application.status
                          )}`}
                        >
                          {application.status ||
                            "Applied"}
                        </span>

                      </div>


                      {/* =================================
                          Application Details
                      ================================= */}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pt-6 border-t">

                        {/* Resume */}

                        <div>

                          <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            Resume
                          </h3>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 rounded-lg p-4">

                            <div className="flex items-center gap-3 min-w-0">

                              <FaFileAlt className="text-purple-600 text-xl shrink-0" />

                              <span className="text-sm text-gray-600 break-all">
                                {application.resume
                                  ? application.resume
                                      .split("/")
                                      .pop()
                                  : "No resume provided"}
                              </span>

                            </div>

                            {application.resume && (
                              <a
                                href={`http://localhost:5000${application.resume}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                              >
                                <FaFileAlt />
                                View Resume
                              </a>
                            )}

                          </div>

                        </div>


                        {/* Applied Date */}

                        <div>

                          <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            Applied On
                          </h3>

                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">

                            <FaBriefcase className="text-purple-600 shrink-0" />

                            <span className="text-sm text-gray-600">
                              {application.createdAt
                                ? new Date(
                                    application.createdAt
                                  ).toLocaleDateString(
                                    "en-PK",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : "N/A"}
                            </span>

                          </div>

                        </div>

                      </div>


                      {/* =================================
                          Cover Letter
                      ================================= */}

                      {application.coverLetter && (
                        <div className="mt-6">

                          <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            Cover Letter
                          </h3>

                          <div className="bg-gray-50 rounded-lg p-4">

                            <p className="text-sm text-gray-600 leading-7 whitespace-pre-line">
                              {application.coverLetter}
                            </p>

                          </div>

                        </div>
                      )}


                      {/* =================================
                          Action Buttons
                      ================================= */}

                      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-6 pt-6 border-t">

                        {/* Shortlist */}

                        <button
                          type="button"
                          disabled={
                            updatingId ===
                              application._id ||
                            application.status ===
                              "Shortlisted" ||
                            application.status ===
                              "Interview"
                          }
                          onClick={() =>
                            updateStatus(
                              application._id,
                              "Shortlisted"
                            )
                          }
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition font-medium"
                        >
                          <FaUserCheck />

                          {updatingId ===
                          application._id
                            ? "Updating..."
                            : application.status ===
                              "Shortlisted"
                            ? "Shortlisted"
                            : application.status ===
                              "Interview"
                            ? "Interview"
                            : "Shortlist"}
                        </button>


                        {/* Reject */}

                        <button
                          type="button"
                          disabled={
                            updatingId ===
                              application._id ||
                            application.status ===
                              "Rejected"
                          }
                          onClick={() =>
                            updateStatus(
                              application._id,
                              "Rejected"
                            )
                          }
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition font-medium"
                        >
                          <FaTimes />

                          {updatingId ===
                          application._id
                            ? "Updating..."
                            : application.status ===
                              "Rejected"
                            ? "Rejected"
                            : "Reject"}
                        </button>


                        {/* Schedule Interview */}

                        {(application.status ===
                          "Shortlisted" ||
                          application.status ===
                            "Interview") && (
                          <button
                            type="button"
                            disabled={
                              application.status ===
                              "Interview"
                            }
                            onClick={() =>
                              openInterviewModal(
                                application
                              )
                            }
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition font-medium"
                          >
                            <FaCalendarAlt />

                            {application.status ===
                            "Interview"
                              ? "Interview Scheduled"
                              : "Schedule Interview"}
                          </button>
                        )}

                      </div>

                    </div>

                  </div>
                );
              }
            )}

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


      {/* ==================================================
          Schedule Interview Modal
      ================================================== */}

      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Overlay */}

          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeInterviewModal}
          ></div>


          {/* Modal */}

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">

            {/* Modal Header */}

            <div className="sticky top-0 z-10 bg-white border-b px-5 sm:px-6 py-4 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Schedule Interview
                </h2>

                {selectedApplication && (
                  <p className="text-sm text-gray-500 mt-1">
                    Candidate:{" "}
                    <span className="font-medium text-gray-700">
                      {selectedApplication
                        .candidate?.name ||
                        "Candidate"}
                    </span>
                  </p>
                )}

              </div>

              <button
                type="button"
                onClick={closeInterviewModal}
                disabled={interviewLoading}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition disabled:opacity-50"
              >
                <FaTimes />
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={scheduleInterview}
              className="p-5 sm:p-6"
            >

              {/* Error */}

              {interviewError && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                  {interviewError}
                </div>
              )}


              {/* Date + Time */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Date */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Date
                  </label>

                  <div className="relative">

                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none" />

                    <input
                      type="date"
                      name="date"
                      value={
                        interviewForm.date
                      }
                      onChange={
                        handleInterviewChange
                      }
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                      required
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                    />

                  </div>

                </div>


                {/* Time */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Time
                  </label>

                  <div className="relative">

                    <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none" />

                    <input
                      type="time"
                      name="time"
                      value={
                        interviewForm.time
                      }
                      onChange={
                        handleInterviewChange
                      }
                      required
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                    />

                  </div>

                </div>

              </div>


              {/* Interview Type */}

              <div className="mt-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Type
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* Online */}

                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
                      interviewForm.type ===
                      "Online"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >

                    <input
                      type="radio"
                      name="type"
                      value="Online"
                      checked={
                        interviewForm.type ===
                        "Online"
                      }
                      onChange={
                        handleInterviewChange
                      }
                      className="accent-purple-600"
                    />

                    <FaVideo className="text-purple-600" />

                    <div>

                      <p className="font-medium text-gray-900">
                        Online
                      </p>

                      <p className="text-xs text-gray-500">
                        Video / meeting call
                      </p>

                    </div>

                  </label>


                  {/* In Person */}

                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
                      interviewForm.type ===
                      "In-Person"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >

                    <input
                      type="radio"
                      name="type"
                      value="In-Person"
                      checked={
                        interviewForm.type ===
                        "In-Person"
                      }
                      onChange={
                        handleInterviewChange
                      }
                      className="accent-purple-600"
                    />

                    <FaMapMarkerAlt className="text-purple-600" />

                    <div>

                      <p className="font-medium text-gray-900">
                        In-Person
                      </p>

                      <p className="text-xs text-gray-500">
                        Office / physical location
                      </p>

                    </div>

                  </label>

                </div>

              </div>


              {/* Online Meeting Link */}

              {interviewForm.type ===
                "Online" && (
                <div className="mt-5">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Link
                  </label>

                  <div className="relative">

                    <FaVideo className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500" />

                    <input
                      type="url"
                      name="meetingLink"
                      value={
                        interviewForm.meetingLink
                      }
                      onChange={
                        handleInterviewChange
                      }
                      placeholder="https://meet.google.com/..."
                      required
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                    />

                  </div>

                </div>
              )}


              {/* Location */}

              {interviewForm.type ===
                "In-Person" && (
                <div className="mt-5">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Location
                  </label>

                  <div className="relative">

                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500" />

                    <input
                      type="text"
                      name="location"
                      value={
                        interviewForm.location
                      }
                      onChange={
                        handleInterviewChange
                      }
                      placeholder="Office address / meeting room"
                      required
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                    />

                  </div>

                </div>
              )}


              {/* Notes */}

              <div className="mt-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                  <span className="text-gray-400 font-normal">
                    {" "}
                    (Optional)
                  </span>
                </label>

                <textarea
                  name="notes"
                  value={
                    interviewForm.notes
                  }
                  onChange={
                    handleInterviewChange
                  }
                  rows="4"
                  placeholder="Add any instructions or notes for the candidate..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                ></textarea>

              </div>


              {/* Buttons */}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6 pt-5 border-t">

                <button
                  type="button"
                  onClick={closeInterviewModal}
                  disabled={interviewLoading}
                  className="w-full sm:w-auto px-5 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={interviewLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition font-medium"
                >

                  {interviewLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <FaCalendarAlt />
                      Schedule Interview
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};


// ==========================================
// Small icon component
// ==========================================

const FaUsersIcon = () => (
  <FaUser />
);

export default JobApplications;