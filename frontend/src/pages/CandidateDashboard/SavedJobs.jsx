import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaBookmark,
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaTrash,
} from "react-icons/fa";

import API from "../../api/api";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // Get Saved Jobs
  // ==========================
  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/saved-jobs/my");

      setSavedJobs(response.data.savedJobs || []);
    } catch (err) {
      console.error("Saved Jobs Error:", err);

      setError(
  err.response?.data?.error ||
  err.response?.data?.message ||
  err.message ||
  "Failed to load saved jobs."
);

    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Fetch on Page Load
  // ==========================
  useEffect(() => {
    fetchSavedJobs();
  }, []);

  // ==========================
  // Remove Saved Job
  // ==========================
  const handleRemove = async (jobId) => {
    try {
      await API.delete(`/saved-jobs/${jobId}`);

      // Remove from UI immediately
      setSavedJobs((prev) =>
        prev.filter((item) => {
          const currentJob = item.job || item;

          return currentJob._id !== jobId;
        })
      );
    } catch (err) {
      console.error("Remove Saved Job Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to remove saved job."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
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
              to="/candidate-dashboard"
              className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition"
            >
              <FaArrowLeft />
              Dashboard
            </Link>

          </div>

        </div>

      </header>


      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-10">

        {/* Heading */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Saved Jobs
          </h1>

          <p className="text-gray-500 mt-2">
            Jobs you saved for later.
          </p>

        </div>


        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-10 text-center">

            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>

            <p className="text-gray-500 mt-4">
              Loading saved jobs...
            </p>

          </div>
        )}


        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-5 mb-6">

            <p className="font-medium">
              {error}
            </p>

          </div>
        )}


        {/* Empty State */}
        {!loading &&
          !error &&
          savedJobs.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-10 text-center">

              <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl">

                <FaBookmark />

              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-5">
                No Saved Jobs
              </h2>

              <p className="text-gray-500 mt-2">
                You haven't saved any jobs yet.
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


        {/* Saved Jobs */}
        {!loading &&
          savedJobs.length > 0 && (

            <div className="space-y-5">

              {savedJobs.map((item) => {

                // Depending on backend response
                // job can be inside item.job
                const job = item.job || item;

                const jobId = job._id;

                return (
                  <div
                    key={item._id || jobId}
                    className="bg-white rounded-xl shadow-lg p-5 sm:p-6"
                  >

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                      {/* Job Information */}
                      <div className="flex items-start gap-4">

                        
                        <div className="w-14 h-14 shrink-0 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden">

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
          "SAVED JOB LOGO FAILED:",
          `http://localhost:5000${job.company.logo}`
        );

        e.currentTarget.style.display = "none";

        const fallback =
          e.currentTarget.parentElement.querySelector(
            ".saved-job-logo-fallback"
          );

        if (fallback) {
          fallback.classList.remove("hidden");
          fallback.classList.add("flex");
        }
      }}
    />
  ) : null}

  <div
    className={`saved-job-logo-fallback ${
      job?.company?.logo ? "hidden" : "flex"
    } w-full h-full items-center justify-center bg-purple-100 text-purple-600 text-xl`}
  >
    <FaBriefcase />
  </div>

</div>


                        <div>

                          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                            {job.title || "Job Title"}
                          </h2>


                          <p className="text-gray-600 mt-1">
                            {job.company?.name ||
                              job.company ||
                              "Company"}
                          </p>


                          <div className="flex flex-wrap gap-4 mt-3">

                            {job.location && (
                              <span className="flex items-center gap-1 text-sm text-gray-500">
                                <FaMapMarkerAlt className="text-purple-500" />
                                {job.location}
                              </span>
                            )}


                            {job.salary && (
                              <span className="flex items-center gap-1 text-sm text-gray-500">
                                <FaMoneyBillWave className="text-green-500" />
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


                      {/* Actions */}
                      <div className="flex items-center gap-3">

                        <Link
                          to={`/jobs/${jobId}`}
                          className="px-4 py-2 border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg transition text-sm"
                        >
                          View Job
                        </Link>


                        <button
                          onClick={() => handleRemove(jobId)}
                          className="w-10 h-10 rounded-lg border border-red-200 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition"
                          title="Remove Saved Job"
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}


        {/* Browse More Jobs */}
        <div className="mt-8">

          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg transition"
          >
            <FaBriefcase />
            Browse More Jobs
          </Link>

        </div>

      </main>

    </div>
  );
};

export default SavedJobs;