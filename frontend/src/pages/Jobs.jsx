import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaBriefcase,
  FaBookmark,
  FaRegBookmark,
  FaArrowRight,
  FaClock,
  FaMoneyBillWave,
  FaFilter,
  FaTimes,
} from "react-icons/fa";

import API from "../api/api";

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // =====================================================
  // Search / Filters
  // =====================================================
  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [location, setLocation] = useState(
    searchParams.get("location") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || "All Categories"
  );

  const [jobType, setJobType] = useState("All Types");

  const [workMode, setWorkMode] = useState("All Modes");

  // =====================================================
  // Jobs
  // =====================================================
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // Sorting / Pagination
  // =====================================================
  const [sortBy, setSortBy] = useState("Most Recent");
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 6;

  // =====================================================
  // Fetch Jobs
  // =====================================================
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/jobs");

        console.log("JOBS RESPONSE:", response.data);

        setJobs(response.data?.jobs || []);
      } catch (err) {
        console.error("Fetch Jobs Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load jobs. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // =====================================================
  // Fetch Saved Jobs
  // =====================================================
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await API.get("/saved-jobs/my");

        console.log("SAVED JOBS RESPONSE:", response.data);

        const saved = response.data?.savedJobs || [];

        const ids = saved.map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return (
            item?.job?._id ||
            item?.jobId ||
            item?._id ||
            ""
          );
        });

        setSavedJobs(ids.filter(Boolean));
      } catch (err) {
        console.log(
          "Saved jobs could not be loaded:",
          err.response?.data?.message || err.message
        );

        setSavedJobs([]);
      }
    };

    fetchSavedJobs();
  }, []);

  // =====================================================
  // Sync URL Params with Search State
  // =====================================================
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlLocation = searchParams.get("location") || "";
    const urlCategory =
      searchParams.get("category") || "All Categories";

    setSearch(urlSearch);
    setLocation(urlLocation);
    setCategory(urlCategory);

    setCurrentPage(1);
  }, [searchParams]);

  // =====================================================
  // Search
  // =====================================================
  const handleSearch = () => {
    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (
      category &&
      category !== "All Categories"
    ) {
      params.category = category;
    }

    if (location.trim()) {
      params.location = location.trim();
    }

    setCurrentPage(1);
    setSearchParams(params);
  };

  // =====================================================
  // Enter Key Search
  // =====================================================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // =====================================================
  // Clear Filters
  // =====================================================
  const handleClearFilters = () => {
    setSearch("");
    setLocation("");
    setCategory("All Categories");
    setJobType("All Types");
    setWorkMode("All Modes");
    setSortBy("Most Recent");
    setCurrentPage(1);

    setSearchParams({});
  };

  // =====================================================
  // Save / Remove Job
  // =====================================================
  const handleSaveJob = async (jobId) => {
    if (!jobId) return;

    try {
      setSavedLoading(true);

      const isSaved = savedJobs.includes(jobId);

      if (isSaved) {
        await API.delete(`/saved-jobs/${jobId}`);

        setSavedJobs((prev) =>
          prev.filter((id) => id !== jobId)
        );
      } else {
        await API.post("/saved-jobs", {
          jobId,
        });

        setSavedJobs((prev) => [
          ...prev,
          jobId,
        ]);
      }
    } catch (err) {
      console.error("Save Job Error:", err);

      alert(
        err.response?.data?.message ||
          "Please login to save jobs."
      );
    } finally {
      setSavedLoading(false);
    }
  };

  // =====================================================
  // Work Mode Helper
  // =====================================================
  const getWorkMode = (job) => {
    const value = String(
      job?.workMode ||
        job?.mode ||
        job?.jobType ||
        job?.location ||
        ""
    ).toLowerCase();

    if (
      value.includes("remote")
    ) {
      return "Remote";
    }

    if (
      value.includes("hybrid")
    ) {
      return "Hybrid";
    }

    if (
      value.includes("on-site") ||
      value.includes("onsite") ||
      value.includes("office")
    ) {
      return "On-site";
    }

    return "";
  };

  // =====================================================
  // Filter Jobs
  // =====================================================
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Search
    if (search.trim()) {
      const searchValue =
        search.trim().toLowerCase();

      result = result.filter((job) => {
        const title = String(
          job?.title || ""
        ).toLowerCase();

        const companyName =
          typeof job?.company === "string"
            ? job.company.toLowerCase()
            : String(
                job?.company?.name || ""
              ).toLowerCase();

        const description = String(
          job?.description || ""
        ).toLowerCase();

        const skills = Array.isArray(
          job?.skills
        )
          ? job.skills.join(" ").toLowerCase()
          : String(
              job?.skills || ""
            ).toLowerCase();

        return (
          title.includes(searchValue) ||
          companyName.includes(searchValue) ||
          description.includes(searchValue) ||
          skills.includes(searchValue)
        );
      });
    }

    // Location
    if (location.trim()) {
      const locationValue =
        location.trim().toLowerCase();

      result = result.filter((job) => {
        const jobLocation = String(
          job?.location || ""
        ).toLowerCase();

        return jobLocation.includes(
          locationValue
        );
      });
    }

    // Category
    if (
      category &&
      category !== "All Categories"
    ) {
      const categoryValue =
        category.toLowerCase();

      result = result.filter((job) => {
        const jobCategory = String(
          job?.category || ""
        ).toLowerCase();

        const jobTitle = String(
          job?.title || ""
        ).toLowerCase();

        return (
          jobCategory.includes(
            categoryValue
          ) ||
          jobTitle.includes(categoryValue)
        );
      });
    }

    // Job Type
    if (
      jobType &&
      jobType !== "All Types"
    ) {
      result = result.filter((job) => {
        const value = String(
          job?.jobType || ""
        ).toLowerCase();

        return (
          value ===
          jobType.toLowerCase()
        );
      });
    }

    // Work Mode
    if (
      workMode &&
      workMode !== "All Modes"
    ) {
      result = result.filter((job) => {
        return (
          getWorkMode(job).toLowerCase() ===
          workMode.toLowerCase()
        );
      });
    }

    // =================================================
    // Sorting
    // =================================================
    if (sortBy === "Most Recent") {
      result.sort((a, b) => {
        const dateA = new Date(
          a?.createdAt ||
            a?.postedAt ||
            a?.created_at ||
            0
        );

        const dateB = new Date(
          b?.createdAt ||
            b?.postedAt ||
            b?.created_at ||
            0
        );

        return dateB - dateA;
      });
    }

    if (sortBy === "Highest Salary") {
      const getSalaryNumber = (job) => {
        const salary = String(
          job?.salary ||
            job?.salaryRange ||
            job?.maxSalary ||
            "0"
        );

        const numbers =
          salary.match(
            /[\d,]+/g
          );

        if (!numbers?.length) {
          return 0;
        }

        return Math.max(
          ...numbers.map((num) =>
            Number(
              num.replace(/,/g, "")
            )
          )
        );
      };

      result.sort(
        (a, b) =>
          getSalaryNumber(b) -
          getSalaryNumber(a)
      );
    }

    if (sortBy === "Most Relevant") {
      result.sort((a, b) => {
        const aScore =
          (a?.featured ? 2 : 0) +
          (a?.isFeatured ? 2 : 0);

        const bScore =
          (b?.featured ? 2 : 0) +
          (b?.isFeatured ? 2 : 0);

        return bScore - aScore;
      });
    }

    return result;
  }, [
    jobs,
    search,
    location,
    category,
    jobType,
    workMode,
    sortBy,
  ]);

  // =====================================================
  // Pagination
  // =====================================================
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredJobs.length / jobsPerPage
    )
  );

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  // =====================================================
  // Reset page when filters change
  // =====================================================
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    location,
    category,
    jobType,
    workMode,
    sortBy,
  ]);

  // =====================================================
  // Company Name
  // =====================================================
  const getCompanyName = (job) => {
    if (
      typeof job?.company === "string"
    ) {
      return job.company;
    }

    return (
      job?.company?.name ||
      "Company"
    );
  };

  // =====================================================
  // Company Logo
  // =====================================================
  const getCompanyLogo = (job) => {
    const logo =
      typeof job?.company === "object"
        ? job?.company?.logo
        : job?.companyLogo;

    if (!logo) {
      return null;
    }

    if (
      logo.startsWith("http://") ||
      logo.startsWith("https://")
    ) {
      return logo;
    }

    return `http://localhost:5000${logo}`;
  };

  // =====================================================
  // Posted Date
  // =====================================================
  const getPostedDate = (job) => {
    const date =
      job?.createdAt ||
      job?.postedAt ||
      job?.created_at;

    if (!date) {
      return "Recently";
    }

    const createdDate =
      new Date(date);

    if (
      Number.isNaN(
        createdDate.getTime()
      )
    ) {
      return "Recently";
    }

    const now = new Date();

    const difference =
      now.getTime() -
      createdDate.getTime();

    const days = Math.floor(
      difference /
        (1000 * 60 * 60 * 24)
    );

    if (days <= 0) {
      return "Today";
    }

    if (days === 1) {
      return "1 day ago";
    }

    if (days < 7) {
      return `${days} days ago`;
    }

    if (days < 30) {
      const weeks = Math.floor(
        days / 7
      );

      return `${weeks} ${
        weeks === 1
          ? "week"
          : "weeks"
      } ago`;
    }

    return createdDate.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // Salary
  // =====================================================
  const getSalary = (job) => {
    return (
      job?.salary ||
      job?.salaryRange ||
      "Salary not specified"
    );
  };

  // =====================================================
  // Loading
  // =====================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Loading jobs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* =====================================================
          Header
      ===================================================== */}
      <div className="bg-[#070B2B] pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-purple-400 font-medium mb-2">
                CareerConnect
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Find Your Dream Job
              </h1>

              <p className="text-gray-300 mt-3">
                Explore the latest job opportunities
                from top companies.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white hover:text-purple-400 transition"
            >
              Back to Home
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          Main
      ===================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* ===================================================
            Search Bar
        =================================================== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="flex items-center gap-3 border rounded-lg px-4 py-3">
              <FaSearch className="text-gray-400 shrink-0" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Job title, keyword..."
                className="outline-none w-full text-sm text-gray-700"
              />
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 border rounded-lg px-4 py-3">
              <FaMapMarkerAlt className="text-gray-400 shrink-0" />

              <input
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Location"
                className="outline-none w-full text-sm text-gray-700"
              />
            </div>

            {/* Category */}
            <div className="flex items-center gap-3 border rounded-lg px-4 py-3">
              <FaBriefcase className="text-gray-400 shrink-0" />

              <select
                value={category}
                onChange={(e) => {
                  setCategory(
                    e.target.value
                  );
                  setCurrentPage(1);
                }}
                className="outline-none w-full text-sm text-gray-700 bg-transparent"
              >
                <option>
                  All Categories
                </option>

                <option>
                  Frontend Developer
                </option>

                <option>
                  Backend Developer
                </option>

                <option>
                  Full Stack Developer
                </option>

                <option>
                  UI/UX Designer
                </option>
              </select>
            </div>

            {/* Search Button */}
            <button
              type="button"
              onClick={handleSearch}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-3 flex items-center justify-center gap-2 transition"
            >
              <FaSearch />
              Search Jobs
            </button>
          </div>

          {/* Extra Filters */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            {/* Job Type */}
            <select
              value={jobType}
              onChange={(e) =>
                setJobType(e.target.value)
              }
              className="border rounded-lg px-4 py-3 text-sm text-gray-700 outline-none bg-white"
            >
              <option>
                All Types
              </option>

              <option>
                Full Time
              </option>

              <option>
                Part Time
              </option>

              <option>
                Contract
              </option>

              <option>
                Internship
              </option>

              <option>
                Freelance
              </option>
            </select>

            {/* Work Mode */}
            <select
              value={workMode}
              onChange={(e) =>
                setWorkMode(e.target.value)
              }
              className="border rounded-lg px-4 py-3 text-sm text-gray-700 outline-none bg-white"
            >
              <option>
                All Modes
              </option>

              <option>
                Remote
              </option>

              <option>
                Hybrid
              </option>

              <option>
                On-site
              </option>
            </select>

            {/* Clear */}
            <button
              type="button"
              onClick={handleClearFilters}
              className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600 hover:text-purple-600 hover:border-purple-300 transition flex items-center justify-center gap-2"
            >
              <FaTimes />
              Clear Filters
            </button>
          </div>
        </div>

        {/* ===================================================
            Error
        =================================================== */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4">
            {error}
          </div>
        )}

        {/* ===================================================
            Top Controls
        =================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Available Jobs
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {filteredJobs.length}{" "}
              {filteredJobs.length === 1
                ? "job"
                : "jobs"}{" "}
              found
            </p>
          </div>

          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 outline-none bg-white"
            >
              <option>
                Most Recent
              </option>

              <option>
                Highest Salary
              </option>

              <option>
                Most Relevant
              </option>
            </select>
          </div>
        </div>

        {/* ===================================================
            No Jobs
        =================================================== */}
        {!loading &&
          paginatedJobs.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-50 flex items-center justify-center">
                <FaSearch className="text-purple-500 text-xl" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-5">
                No jobs found
              </h3>

              <p className="text-gray-500 mt-2">
                Try changing your search or
                filters.
              </p>

              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg transition"
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* ===================================================
            Job Grid
        =================================================== */}
        {paginatedJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedJobs.map((job) => {
              const jobId = job?._id;

              const companyName =
                getCompanyName(job);

              const companyLogo =
                getCompanyLogo(job);

              const isSaved =
                savedJobs.includes(
                  jobId
                );

              return (
                <div
                  key={jobId}
                  className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition duration-300 p-6 relative"
                >
                  {/* Bookmark */}
                  <button
                    type="button"
                    disabled={savedLoading}
                    onClick={() =>
                      handleSaveJob(jobId)
                    }
                    className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-50 hover:bg-purple-50 flex items-center justify-center transition"
                    title={
                      isSaved
                        ? "Remove from saved jobs"
                        : "Save job"
                    }
                  >
                    {isSaved ? (
                      <FaBookmark className="text-purple-600" />
                    ) : (
                      <FaRegBookmark className="text-gray-500" />
                    )}
                  </button>

                  {/* Company Logo */}
                  <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center overflow-hidden mb-5">
                    {companyLogo ? (
                      <img
                        src={companyLogo}
                        alt={companyName}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                          e.currentTarget.parentElement.innerHTML =
                            `<span class="text-purple-600 font-bold text-xl">${companyName
                              .charAt(0)
                              .toUpperCase()}</span>`;
                        }}
                      />
                    ) : (
                      <span className="text-purple-600 font-bold text-xl">
                        {companyName
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Job Title */}
                  <Link
                    to={`/jobs/${jobId}`}
                    className="block"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition pr-8">
                      {job?.title ||
                        "Untitled Job"}
                    </h3>
                  </Link>

                  {/* Company */}
                  <p className="text-gray-500 text-sm mt-1">
                    {companyName}
                  </p>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-4">
                    <FaMapMarkerAlt className="text-gray-400" />

                    <span>
                      {job?.location ||
                        "Location not specified"}
                    </span>
                  </div>

                  {/* Salary */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-3">
                    <FaMoneyBillWave className="text-gray-400" />

                    <span>
                      {getSalary(job)}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    {job?.jobType && (
                      <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                        {job.jobType}
                      </span>
                    )}

                    {job?.category && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                        {job.category}
                      </span>
                    )}

                    {getWorkMode(job) && (
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                        {getWorkMode(job)}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-100 mt-5 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <FaClock />
                      {getPostedDate(job)}
                    </div>

                    <Link
                      to={`/jobs/${jobId}`}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                    >
                      View Details
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===================================================
            Pagination
        =================================================== */}
        {filteredJobs.length > jobsPerPage && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.max(
                      1,
                      prev - 1
                    )
                )
              }
              className="px-4 py-2 border rounded-lg text-sm text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-purple-400 hover:text-purple-600 transition"
            >
              Previous
            </button>

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`w-10 h-10 rounded-lg text-sm transition ${
                  currentPage === page
                    ? "bg-purple-600 text-white"
                    : "border text-gray-600 hover:border-purple-400 hover:text-purple-600"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.min(
                      totalPages,
                      prev + 1
                    )
                )
              }
              className="px-4 py-2 border rounded-lg text-sm text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-purple-400 hover:text-purple-600 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;