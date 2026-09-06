import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
} from "react-icons/fa";

import API from "../../api/api";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // Fetch My Jobs
  // ==========================
useEffect(() => {
  const fetchMyJobs = async () => {
    try {
      setLoading(true);

      const response = await API.get("/jobs/my-jobs");

      console.log("MY JOBS:", response.data);
      console.log("FIRST JOB:", response.data.jobs?.[0]);
      console.log("COMPANY:", response.data.jobs?.[0]?.company);
      console.log(
        "COMPANY LOGO:",
        response.data.jobs?.[0]?.company?.logo
      );

      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("My Jobs Error:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load your jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchMyJobs(); // ⭐ YE MISSING THA
}, []);
  // ==========================
  // Delete Job
  // ==========================

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/jobs/${jobId}`);

      setJobs((prev) =>
        prev.filter((job) => job._id !== jobId)
      );

      alert("Job deleted successfully.");
    } catch (error) {
      console.error("Delete Job Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete job."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <div className="bg-[#070B2B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <p className="text-purple-400 text-sm">
                EMPLOYER PANEL
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold mt-1">
                My Jobs
              </h1>

              <p className="text-gray-300 text-sm mt-2">
                Manage your posted job opportunities.
              </p>
            </div>

            <Link
              to="/post-job"
              className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg transition"
            >
              <FaPlus />
              Post New Job
            </Link>

          </div>

        </div>
      </div>

      {/* Main */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Error */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* Loading */}

        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">

            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>

            <p className="text-gray-500 mt-4">
              Loading your jobs...
            </p>

          </div>
        )}

        {/* Empty */}

        {!loading && !error && jobs.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">

            <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl">
              <FaBriefcase />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-5">
              No Jobs Posted Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Start by posting your first job opportunity.
            </p>

            <Link
              to="/post-job"
              className="inline-flex items-center gap-2 mt-6 bg-purple-600 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg transition"
            >
              <FaPlus />
              Post a Job
            </Link>

          </div>
        )}

        {/* Jobs */}

        {!loading && !error && jobs.length > 0 && (

          <div className="space-y-5">

            {/* Count */}

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Your Posted Jobs
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {jobs.length} job
                  {jobs.length !== 1 ? "s" : ""} posted
                </p>
              </div>

            </div>

            {/* Job Cards */}

            {jobs.map((job) => (

              <div
                key={job._id}
                className="bg-white rounded-xl shadow-lg p-5 sm:p-6 hover:shadow-2xl transition"
              >

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                  {/* Job Info */}

                  <div className="flex items-start gap-4">

                    <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
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

  <div
    className={`logo-fallback ${
      job?.company?.logo ? "hidden" : "flex"
    } w-full h-full items-center justify-center bg-purple-100 text-purple-600 text-xl`}
  >
    <FaBriefcase />
  </div>
</div>

                    <div>

                      <h3 className="text-lg font-bold text-gray-900">
                        {job.title}
                      </h3>

                      <p className="text-sm text-gray-600 mt-1">
                        {job.company?.name || "Company"}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-3">

                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <FaMapMarkerAlt className="text-purple-500" />
                          {job.location}
                        </span>

                        {job.salary && (
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <FaMoneyBillWave className="text-green-500" />
                            {job.salary}
                          </span>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* Job Type */}

                  <div className="flex flex-wrap items-center gap-3">

                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-medium">
                      {job.jobType}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                      Active
                    </span>

                  </div>

                </div>

                {/* Bottom */}

                <div className="border-t mt-5 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  <div className="flex items-center gap-2">

                    <span className="text-sm text-gray-500">
                      Category:
                    </span>

                    <span className="text-sm font-medium text-gray-700">
                      {job.category}
                    </span>

                  </div>

                  {/* Actions */}

                  <div className="flex items-center gap-2">

                    <Link
                      to={`/jobs/${job._id}`}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-purple-600 hover:border-purple-500 transition"
                      title="View Job"
                    >
                      <FaEye />
                    </Link>

                    <Link
                 to={`/employer/jobs/edit/${job._id}`}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-purple-600 hover:border-purple-500 transition"
                 title="Edit Job"
                     >
                    <FaEdit />
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(job._id)
                      }
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-500 transition"
                      title="Delete Job"
                    >
                      <FaTrash />
                    </button>

                    <Link
                      to={`/employer/applications/${job._id}`}
                      className="px-4 h-10 rounded-lg bg-purple-600 hover:bg-yellow-600 text-white flex items-center justify-center gap-2 text-sm transition"
                    >
                      <FaEye />
                      Applicants
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
};

export default MyJobs;