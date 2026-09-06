import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaClock,
  FaBuilding,
  FaBookmark,
   FaEnvelope,
} from "react-icons/fa";

import API from "../api/api";

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [resume, setResume] = useState(null);
  // ==========================
  // Fetch Job Details
  // ==========================
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/jobs/${id}`);

        setJob(response.data.job || response.data);
      } catch (error) {
        console.error("Job Details Error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load job details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // ==========================
  // Check Saved Job
  // ==========================
  useEffect(() => {
    const checkSavedJob = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await API.get(
          `/saved-jobs/check/${id}`
        );

        setSaved(response.data.saved);
      } catch (error) {
        console.log("Saved Job Check:", error);
      }
    };

    checkSavedJob();
  }, [id]);

  // ==========================
  // Check Already Applied
  // ==========================
  useEffect(() => {
    const checkApplication = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await API.get(
          `/applications/check/${id}`
        );

        setApplied(response.data.applied);
      } catch (error) {
        console.log("Application Check:", error);
      }
    };

    checkApplication();
  }, [id]);

  // ==========================
  // Save / Remove Job
  // ==========================
  const handleSaveJob = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login as a candidate to save jobs.");
      return;
    }

    try {
      setSaving(true);

      if (saved) {
        await API.delete(`/saved-jobs/${id}`);

        setSaved(false);
      } else {
        await API.post("/saved-jobs", {
          jobId: id,
        });

        setSaved(true);
      }
    } catch (error) {
      console.error("Save Job Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update saved job."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================
  // Apply Job
  // ==========================
const handleApply = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login as a candidate to apply for this job.");
    return;
  }

  if (applied) {
    alert("You have already applied for this job.");
    return;
  }


  if (!resume) {
  alert("Please upload your CV/Resume before applying.");
  return;
}

  try {
    setApplying(true);

    const formData = new FormData();

formData.append("job", job._id);

if (resume) {
  formData.append("resume", resume);
}

await API.post("/applications/apply", formData);

    setApplied(true);

    alert("Application submitted successfully! 🎉");
  } catch (error) {
    console.error("Apply Job Error:", error);

    alert(
      error.response?.data?.message ||
        "Failed to apply for this job."
    );
  } finally {
    setApplying(false);
  }
};

  // ==========================
  // Loading
  // ==========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>

          <p className="text-gray-500 mt-4">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  // ==========================
  // Error
  // ==========================
  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-100">

        <header className="bg-[#070B2B] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="h-20 flex items-center justify-between">

              <h1 className="text-2xl font-bold">
                Career
                <span className="text-purple-500">
                  Connect
                </span>
              </h1>

              <Link
                to="/jobs"
                className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition"
              >
                <FaArrowLeft />
                Back to Jobs
              </Link>

            </div>

          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-16">

          <div className="bg-white rounded-xl shadow-lg p-10 text-center">

            <FaBriefcase className="text-5xl text-gray-300 mx-auto" />

            <h2 className="text-2xl font-bold text-gray-900 mt-5">
              Job Not Found
            </h2>

            <p className="text-gray-500 mt-2">
              {error || "This job could not be found."}
            </p>

            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 mt-6 bg-purple-600 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition"
            >
              <FaArrowLeft />
              Back to Jobs
            </Link>

          </div>

        </main>

      </div>
    );
  }

  // ==========================
  // Main
  // ==========================
  return (
    <div className="min-h-screen bg-gray-100">

      {/* ==========================
          Header
      ========================== */}
      <header className="bg-[#070B2B] text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">

            <h1 className="text-2xl font-bold">
              Career
              <span className="text-purple-500">
                Connect
              </span>
            </h1>

            <Link
              to="/jobs"
              className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition"
            >
              <FaArrowLeft />
              Back to Jobs
            </Link>

          </div>

        </div>

      </header>

      {/* ==========================
          Main
      ========================== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ==========================
            Job Header
        ========================== */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            {/* Job Info */}
            <div className="flex gap-5">

              {/* Company Logo */}
             <div className="w-20 h-20 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">

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
          "JOB DETAILS LOGO FAILED:",
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
    } w-full h-full items-center justify-center bg-purple-100 text-purple-600 text-3xl font-bold`}
  >
    {job?.company?.name
      ?.charAt(0)
      ?.toUpperCase() || "C"}
  </div>
      </div>

              <div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {job.title}
                </h1>

                <p className="text-lg text-gray-600 mt-2">
                  {job.company?.name || "Company"}
                </p>

                <div className="flex flex-wrap gap-4 mt-4">

                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <FaMapMarkerAlt className="text-purple-500" />
                    {job.location}
                  </span>

                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <FaBriefcase className="text-purple-500" />
                    {job.jobType}
                  </span>

                  {job.salary && (
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <FaMoneyBillWave className="text-green-500" />
                      {job.salary}
                    </span>
                  )}

                </div>

              </div>

            </div>

            {/* Bookmark */}
            <button
              type="button"
              onClick={handleSaveJob}
              disabled={saving}
              className={`w-11 h-11 rounded-lg border flex items-center justify-center transition self-end md:self-start ${
                saved
                  ? "text-purple-600 border-purple-500 bg-purple-50"
                  : "text-gray-400 border-gray-200 hover:text-purple-600 hover:border-purple-500"
              }`}
              title={
                saved
                  ? "Remove from saved jobs"
                  : "Save job"
              }
            >
              <FaBookmark />
            </button>

          </div>

        </div>

        {/* ==========================
            Content
        ========================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

          {/* ==========================
              Left Content
          ========================== */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Job Description
              </h2>

              <p className="text-gray-600 leading-7 whitespace-pre-line">
                {job.description}
              </p>

            </div>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">

                <h2 className="text-xl font-bold text-gray-900 mb-5">
                  Required Skills
                </h2>

                <div className="flex flex-wrap gap-3">

                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

              </div>
            )}

            {/* Experience */}
            {job.experience && (
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">

                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Experience Required
                </h2>

                <p className="text-gray-600">
                  {job.experience}
                </p>

              </div>
            )}

          </div>

          {/* ==========================
              Right Sidebar
          ========================== */}
          <div className="space-y-6">

            {/* Apply Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">

              <h2 className="text-xl font-bold text-gray-900">
                Interested in this job?
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Apply now and take the next step in your career.
              </p>

                  <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Resume / CV
           </label>

                <input
               type="file"
              accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
             className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-gray-50"
            />

          {resume && (
         <p className="text-xs text-green-600 mt-2">
          Selected: {resume.name}
                </p>
               )}
               </div>


              <button
                type="button"
                onClick={handleApply}
                disabled={applying || applied}
                className={`w-full mt-6 text-white py-3 rounded-lg transition font-medium ${
                  applied
                    ? "bg-green-600 cursor-not-allowed"
                    : applying
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-yellow-600"
                }`}
              >
                {applied
                  ? "Already Applied"
                  : applying
                  ? "Applying..."
                  : "Apply Now"}
              </button>


{job.postedBy?._id && (
  <Link
    to={`/messages/${job.postedBy._id}`}
    className="w-full mt-3 inline-flex items-center justify-center gap-2 border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white py-3 rounded-lg transition font-medium"
  >
    <FaEnvelope />
    Message Recruiter
  </Link>
)}



            </div>

            {/* ==========================
                Job Overview
            ========================== */}
            <div className="bg-white rounded-xl shadow-lg p-6">

              <h2 className="text-xl font-bold text-gray-900 mb-5">
                Job Overview
              </h2>

              <div className="space-y-4">

                {/* Job Type */}
                <div className="flex items-center gap-3">

                  <FaBriefcase className="text-purple-600" />

                  <div>

                    <p className="text-xs text-gray-400">
                      Job Type
                    </p>

                    <p className="text-sm font-medium text-gray-700">
                      {job.jobType}
                    </p>

                  </div>

                </div>

                {/* Category */}
                <div className="flex items-center gap-3">

                  <FaBuilding className="text-purple-600" />

                  <div>

                    <p className="text-xs text-gray-400">
                      Category
                    </p>

                    <p className="text-sm font-medium text-gray-700">
                      {job.category}
                    </p>

                  </div>

                </div>

                {/* Experience */}
                {job.experience && (
                  <div className="flex items-center gap-3">

                    <FaClock className="text-purple-600" />

                    <div>

                      <p className="text-xs text-gray-400">
                        Experience
                      </p>

                      <p className="text-sm font-medium text-gray-700">
                        {job.experience}
                      </p>

                    </div>

                  </div>
                )}

                {/* Deadline */}
                {job.deadline && (
                  <div className="flex items-center gap-3">

                    <FaClock className="text-purple-600" />

                    <div>

                      <p className="text-xs text-gray-400">
                        Application Deadline
                      </p>

                      <p className="text-sm font-medium text-gray-700">
                        {new Date(
                          job.deadline
                        ).toLocaleDateString()}

                      </p>

                    </div>

                  </div>
                )}

              </div>

            </div>

            {/* ==========================
                Company
            ========================== */}
            <div className="bg-white rounded-xl shadow-lg p-6">

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About the Company
              </h2>

              <p className="font-semibold text-gray-800">
                {job.company?.name || "Company"}
              </p>

              {job.company?.location && (
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-purple-500" />
                  {job.company.location}
                </p>
              )}

              {job.company?.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-purple-600 hover:text-purple-800 text-sm"
                >
                  Visit Company Website
                </a>
              )}

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default JobDetails;