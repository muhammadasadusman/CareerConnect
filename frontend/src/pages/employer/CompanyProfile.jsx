import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaBuilding,
  FaGlobe,
  FaMapMarkerAlt,
  FaBriefcase,
  FaEdit,
  FaSave,
  FaTrash,
  FaExternalLinkAlt,
  FaPlus,
} from "react-icons/fa";

import API from "../../api/api";

const CompanyProfile = () => {
  const navigate = useNavigate();

  // ==========================
  // States
  // ==========================

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================
  // Fetch Company + Jobs
  // ==========================

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        setError("");

        // Get logged-in recruiter's company
        const companyResponse = await API.get(
          "/companies/my-company"
        );

        const companyData =
          companyResponse.data.company;

        setCompany(companyData);

        // Get recruiter's jobs
        try {
          const jobsResponse = await API.get(
            "/jobs/my-jobs"
          );

          const allJobs =
            jobsResponse.data.jobs || [];

          // Only show jobs belonging to this company
          const companyJobs = allJobs.filter(
            (job) => {
              const jobCompany =
                job.company?._id ||
                job.company;

              return (
                jobCompany?.toString() ===
                companyData._id?.toString()
              );
            }
          );

          setJobs(companyJobs);
        } catch (jobError) {
          console.error(
            "Fetch Company Jobs Error:",
            jobError
          );

          setJobs([]);
        }
      } catch (error) {
        console.error(
          "Fetch Company Profile Error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load company profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  // ==========================
  // Input Change
  // ==========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================
  // Save Company
  // ==========================

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!company?.name || !company?.location) {
        setError(
          "Company name and location are required."
        );
        return;
      }

      const data = {
        name: company.name,
        logo: company.logo || "",
        description: company.description || "",
        location: company.location,
        website: company.website || "",
        industry: company.industry || "",
      };

      const response = await API.put(
        `/companies/${company._id}`,
        data
      );

      setCompany(
        response.data.company || {
          ...company,
          ...data,
        }
      );

      setIsEditing(false);

      setSuccess(
        "Company profile updated successfully!"
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "Update Company Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update company."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================
  // Delete Company
  // ==========================

  const handleDelete = async () => {
    if (!company?._id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your company profile? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);
      setError("");

      await API.delete(
        `/companies/${company._id}`
      );

      alert("Company deleted successfully.");

      navigate("/employer-dashboard");
    } catch (error) {
      console.error(
        "Delete Company Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete company."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==========================
  // Website URL
  // ==========================

  const getWebsiteUrl = (website) => {
    if (!website) return "";

    if (
      website.startsWith("http://") ||
      website.startsWith("https://")
    ) {
      return website;
    }

    return `https://${website}`;
  };

  // ==========================
  // Company Initials
  // ==========================

  const getInitials = (name) => {
    if (!name) return "CC";

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">

        <header className="bg-[#070B2B] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="min-h-20 flex items-center justify-between">

              <h1 className="text-2xl font-bold">
                Career
                <span className="text-purple-500">
                  Connect
                </span>
              </h1>

              <Link
                to="/employer-dashboard"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-purple-400 transition"
              >
                <FaArrowLeft />
                Dashboard
              </Link>

            </div>

          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-16">

          <div className="bg-white rounded-xl shadow-lg p-12 text-center">

            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>

            <p className="text-gray-500 mt-4">
              Loading company profile...
            </p>

          </div>

        </main>

      </div>
    );
  }

  // ==========================
  // Error
  // ==========================

  if (error && !company) {
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
                Dashboard
              </Link>

            </div>

          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-16">

          <div className="bg-white rounded-xl shadow-lg p-10 text-center">

            <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto text-2xl">
              <FaBuilding />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-5">
              Company Profile Not Found
            </h2>

            <p className="text-gray-500 mt-2">
              {error}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">

              <Link
                to="/employer/company/create"
                className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition"
              >
                <FaPlus />
                Create Company
              </Link>

              <Link
                to="/employer-dashboard"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-3 rounded-lg transition"
              >
                <FaArrowLeft />
                Dashboard
              </Link>

            </div>

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

      {/* =========================================
          Header
      ========================================= */}

      <header className="bg-[#070B2B] text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="min-h-20 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            {/* Logo */}

            <div>

              <h1 className="text-2xl font-bold">
                Career
                <span className="text-purple-500">
                  Connect
                </span>
              </h1>

              <p className="text-gray-400 text-sm mt-1">
                Employer Panel
              </p>

            </div>

            {/* Back */}

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


      {/* =========================================
          Main
      ========================================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Page Heading */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

          <div>

            <p className="text-sm text-purple-600 font-medium">
              EMPLOYER PANEL
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Company Profile
            </h1>

            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Manage your company information and posted jobs.
            </p>

          </div>


          {/* Edit / Save */}

          {!isEditing ? (

            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccess("");
                setIsEditing(true);
              }}
              className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg transition"
            >
              <FaEdit />
              Edit Profile
            </button>

          ) : (

            <div className="flex flex-col sm:flex-row gap-3">

              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setError("");
                }}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg transition disabled:opacity-60"
              >
                <FaSave />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          )}

        </div>


        {/* Success */}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
            {success}
          </div>
        )}


        {/* Error */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
            {error}
          </div>
        )}


        {/* =========================================
            Profile Layout
        ========================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


          {/* =======================================
              Company Card
          ======================================= */}

          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-fit">

            {/* Header */}

            <div className="h-28 bg-gradient-to-r from-[#070B2B] to-purple-700"></div>


            {/* Company Info */}

            <div className="px-6 pb-6">

              {/* Logo */}

              <div className="-mt-12 mb-4">

                <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">

    {company?.logo ? (
      <img
        src={
          company.logo.startsWith("http")
            ? company.logo
            : `http://localhost:5000${company.logo}`
        }
        alt={company?.name || "Company"}
        className="w-full h-full object-contain p-2"
        onError={(e) => {
          console.error(
            "COMPANY PROFILE LOGO FAILED:",
            `http://localhost:5000${company.logo}`
          );

          e.currentTarget.style.display = "none";

          const fallback =
            e.currentTarget.parentElement.querySelector(
              ".company-profile-logo-fallback"
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
      className={`company-profile-logo-fallback ${
        company?.logo ? "hidden" : "flex"
      } w-full h-full items-center justify-center bg-purple-100 text-purple-600 text-3xl font-bold`}
    >
      {getInitials(company?.name)}
    </div>

  </div>

              </div>


              <h2 className="text-xl font-bold text-gray-900 break-words">
                {company.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {company.industry ||
                  "Technology Company"}
              </p>


              {/* Location */}

              <div className="flex items-start gap-2 text-sm text-gray-500 mt-4">

                <FaMapMarkerAlt className="text-purple-500 mt-1 shrink-0" />

                <span>
                  {company.location ||
                    "Location not provided"}
                </span>

              </div>


              {/* Industry */}

              <div className="flex items-start gap-2 text-sm text-gray-500 mt-3">

                <FaBriefcase className="text-purple-500 mt-1 shrink-0" />

                <span>
                  {company.industry ||
                    "Industry not provided"}
                </span>

              </div>


              {/* Website */}

              {company.website && (

                <a
                  href={getWebsiteUrl(
                    company.website
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm text-purple-600 hover:text-purple-800 mt-3 break-all"
                >

                  <FaGlobe className="mt-1 shrink-0" />

                  <span>
                    {company.website}
                  </span>

                  <FaExternalLinkAlt className="text-xs mt-1 shrink-0" />

                </a>

              )}

            </div>

          </div>


          {/* =======================================
              Company Information
          ======================================= */}

          <div className="lg:col-span-2">

            <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 lg:p-8">

              <div className="mb-6">

                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Company Information
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Basic information about your company.
                </p>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                {/* Company Name */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>

                  <div className="relative">

                    <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      name="name"
                      value={company.name || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600 transition"
                    />

                  </div>

                </div>


                {/* Location */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>

                  <div className="relative">

                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      name="location"
                      value={company.location || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600 transition"
                    />

                  </div>

                </div>


                {/* Website */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>

                  <div className="relative">

                    <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      name="website"
                      value={company.website || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="https://example.com"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600 transition"
                    />

                  </div>

                </div>


                {/* Industry */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>

                  <input
                    type="text"
                    name="industry"
                    value={company.industry || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Information Technology"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600 transition"
                  />

                </div>


                {/* Logo */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo URL
                  </label>

                  <input
                    type="text"
                    name="logo"
                    value={company.logo || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600 transition"
                  />

                </div>


                {/* Description */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      company.description || ""
                    }
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="6"
                    placeholder="Tell candidates about your company..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600 transition resize-none"
                  />

                </div>

              </div>


              {/* Save Buttons */}

              {isEditing && (

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-7 pt-6 border-t">

                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setError("");
                    }}
                    disabled={saving}
                    className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition disabled:opacity-60"
                  >
                    <FaSave />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>

              )}

            </div>


            {/* =======================================
                Delete Company
            ======================================= */}

            {!isEditing && (

              <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 mt-6">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>

                    <h3 className="font-semibold text-gray-900">
                      Delete Company Profile
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Permanently remove your company profile.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg transition disabled:opacity-60"
                  >
                    <FaTrash />

                    {deleting
                      ? "Deleting..."
                      : "Delete Company"}
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>


        {/* =========================================
            Posted Jobs
        ========================================= */}

        <section className="mt-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

            <div>

              <p className="text-sm text-purple-600 font-medium">
                CAREER OPPORTUNITIES
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                Posted Jobs
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Jobs currently posted by your company.
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


          {/* No Jobs */}

          {jobs.length === 0 && (

            <div className="bg-white rounded-xl shadow-lg p-10 sm:p-12 text-center">

              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                <FaBriefcase />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mt-5">
                No Jobs Posted Yet
              </h3>

              <p className="text-gray-500 mt-2">
                Start posting jobs to attract talented candidates.
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

          {jobs.length > 0 && (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {jobs.map((job) => (

                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow-lg p-5 sm:p-6 hover:shadow-2xl transition"
                >

                  <div className="flex items-start gap-4">

                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg shrink-0">
                      <FaBriefcase />
                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="text-lg font-bold text-gray-900 break-words">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap gap-3 mt-3">

                        {job.location && (

                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <FaMapMarkerAlt className="text-purple-500" />
                            {job.location}
                          </span>

                        )}

                        {job.salary && (

                          <span className="text-sm text-gray-500">
                            {job.salary}
                          </span>

                        )}

                      </div>

                    </div>

                  </div>


                  {/* Tags */}

                  <div className="flex flex-wrap gap-2 mt-4">

                    {job.jobType && (

                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                        {job.jobType}
                      </span>

                    )}

                    {job.category && (

                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                        {job.category}
                      </span>

                    )}

                  </div>


                  {/* Bottom */}

                  <div className="border-t mt-5 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <span className="text-sm text-gray-500">

                      {job.deadline
                        ? `Deadline: ${new Date(
                            job.deadline
                          ).toLocaleDateString(
                            "en-PK",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}`
                        : "No deadline"}

                    </span>


                    <Link
                      to={`/jobs/${job._id}`}
                      className="inline-flex items-center justify-center gap-2 text-purple-600 hover:text-purple-800 font-medium text-sm"
                    >
                      View Job
                      <FaExternalLinkAlt className="text-xs" />
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


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

export default CompanyProfile;