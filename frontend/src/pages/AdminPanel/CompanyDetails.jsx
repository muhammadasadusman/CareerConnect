import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
  FaArrowLeft,
  FaBuilding,
  FaMapMarkerAlt,
  FaGlobe,
  FaIndustry,
  FaUser,
  FaEnvelope,
  FaExternalLinkAlt,
  FaTrash,
  FaSyncAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

import API from "../../api/api";
import Navbar from "../../components/Navbar/Navbar";
import { getImageUrl, getInitials } from "../../utils/imageUrl";

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminView = location.pathname.startsWith("/admin-panel");
  const storedUser = localStorage.getItem("user");
  let currentUser = null;
  try {
    currentUser = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    currentUser = null;
  }
  const showAdminControls = isAdminView && currentUser?.role === "admin";

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ==========================================
  // FETCH COMPANY
  // ==========================================

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(`/companies/${id}`);

      setCompany(response.data);
    } catch (err) {
      console.error("Company Details Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load company details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

  // ==========================================
  // DELETE COMPANY
  // ==========================================

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);
      setError("");

      await API.delete(`/admin/companies/${id}`);

      navigate("/admin-panel");
    } catch (err) {
      console.error("Delete Company Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete company."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <FaSyncAlt className="text-purple-600 text-3xl mx-auto animate-spin" />

          <p className="text-gray-500 mt-4">
            Loading company details...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          <button
            onClick={() => navigate(isAdminView ? "/admin-panel" : "/companies")}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition mb-6"
          >
            <FaArrowLeft />
            {isAdminView ? "Back to Admin Panel" : "Back to Companies"}
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FaExclamationTriangle className="text-red-500 text-4xl mx-auto" />

            <h1 className="text-xl font-bold text-gray-900 mt-4">
              Company Not Found
            </h1>

            <p className="text-gray-500 mt-2">
              {error || "This company could not be found."}
            </p>

            <button
              onClick={fetchCompany}
              className="mt-6 inline-flex items-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg transition"
            >
              <FaSyncAlt />
              Try Again
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // COMPANY DATA
  // ==========================================

  const companyName =
    company.name ||
    company.companyName ||
    "Unnamed Company";

  const recruiterName =
    company.recruiter?.name || "Not available";

  const recruiterEmail =
    company.recruiter?.email || "Not available";

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <header className="bg-[#070B2B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-lg shrink-0">
                {companyName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <h1 className="font-bold text-lg sm:text-xl truncate">
                  Career
                  <span className="text-purple-500">
                    Connect
                  </span>
                </h1>

                <p className="text-xs text-gray-400 truncate">
                  Company Details
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/admin-panel")}
              className="flex items-center gap-2 border border-white/20 hover:border-purple-500 hover:bg-purple-600 px-3 sm:px-4 py-2 rounded-lg text-sm transition shrink-0"
            >
              <FaArrowLeft />
              <span className="hidden sm:inline">
                Back
              </span>
            </button>

          </div>

        </div>
      </header>

      {/* MAIN */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* PAGE TITLE */}

        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Admin Panel / Companies / Details
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            Company Details
          </h2>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3">
            <FaExclamationTriangle />

            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="ml-auto font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* COMPANY HERO */}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="h-28 sm:h-36 bg-gradient-to-r from-[#070B2B] to-purple-700"></div>

          <div className="px-5 sm:px-8 pb-8">

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 -mt-12">

              {/* LOGO */}

              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white shadow-xl border-4 border-white flex items-center justify-center overflow-hidden">

                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={companyName}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl font-bold text-purple-600">
                    {companyName
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}

              </div>

              {/* ACTION */}

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 px-4 py-2.5 rounded-lg transition disabled:opacity-50 w-full sm:w-auto"
              >
                {deleteLoading ? (
                  <FaSyncAlt className="animate-spin" />
                ) : (
                  <FaTrash />
                )}

                {deleteLoading
                  ? "Deleting..."
                  : "Delete Company"}
              </button>

            </div>

            {/* COMPANY NAME */}

            <div className="mt-5">

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {companyName}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3">

                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <FaMapMarkerAlt className="text-purple-600" />
                  {company.location ||
                    "Location not specified"}
                </span>

                {company.industry && (
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <FaIndustry className="text-purple-600" />
                    {company.industry}
                  </span>
                )}

              </div>

            </div>

          </div>

        </div>

        {/* DETAILS GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

          {/* ABOUT */}

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-5 sm:p-7">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <FaBuilding />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  About Company
                </h2>

                <p className="text-sm text-gray-500">
                  Company information
                </p>
              </div>

            </div>

            <p className="text-gray-600 leading-7 whitespace-pre-line">
              {company.description ||
                "No company description has been provided."}
            </p>

          </div>

          {/* COMPANY INFO */}

          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-7">

            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Company Information
            </h2>

            <div className="space-y-5">

              {/* LOCATION */}

              <div className="flex items-start gap-3">

                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">
                    Location
                  </p>

                  <p className="text-sm font-medium text-gray-900 mt-1 break-words">
                    {company.location ||
                      "Not specified"}
                  </p>
                </div>

              </div>

              {/* INDUSTRY */}

              <div className="flex items-start gap-3">

                <div className="w-9 h-9 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <FaIndustry />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">
                    Industry
                  </p>

                  <p className="text-sm font-medium text-gray-900 mt-1 break-words">
                    {company.industry ||
                      "Not specified"}
                  </p>
                </div>

              </div>

              {/* WEBSITE */}

              <div className="flex items-start gap-3">

                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <FaGlobe />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">
                    Website
                  </p>

                  {company.website ? (
                    <a
                      href={
                        company.website.startsWith("http")
                          ? company.website
                          : `https://${company.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-purple-600 hover:text-purple-800 mt-1 inline-flex items-center gap-1 break-all"
                    >
                      Visit Website
                      <FaExternalLinkAlt className="text-xs" />
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      Not provided
                    </p>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* RECRUITER */}

        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-7 mt-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <FaUser />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recruiter
              </h2>

              <p className="text-sm text-gray-500">
                Company owner information
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* NAME */}

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">

              <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                {recruiterName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-400">
                  Recruiter Name
                </p>

                <p className="font-semibold text-gray-900 mt-1 truncate">
                  {recruiterName}
                </p>
              </div>

            </div>

            {/* EMAIL */}

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">

              <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <FaEnvelope />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-400">
                  Recruiter Email
                </p>

                <p className="font-semibold text-gray-900 mt-1 break-all">
                  {recruiterEmail}
                </p>
              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default CompanyDetails;