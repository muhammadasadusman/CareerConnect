import { FaBriefcase, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// =====================================================
// BACKEND URL
// =====================================================
const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const CompanyCard = ({ company }) => {
  const navigate = useNavigate();

  // =====================================================
  // COMPANY CLICK
  // =====================================================
  const handleClick = () => {
    if (!company?._id && !company?.id) {
      console.error("Company ID is missing:", company);
      return;
    }

    navigate(`/companies/${company._id || company.id}`);
  };

  // =====================================================
  // COMPANY NAME
  // =====================================================
  const companyName = company?.name || "Company";

  // =====================================================
  // COMPANY LOGO URL
  // =====================================================
  const getLogoUrl = (logo) => {
    if (!logo || typeof logo !== "string") {
      return null;
    }

    const cleanLogo = logo.trim();

    if (!cleanLogo) {
      return null;
    }

    // ===================================================
    // Already HTTPS URL
    // ===================================================
    if (cleanLogo.startsWith("https://")) {
      return cleanLogo;
    }

    // ===================================================
    // HTTP URL
    // Convert HTTP → HTTPS for production
    // ===================================================
    if (cleanLogo.startsWith("http://")) {
      return cleanLogo.replace(/^http:\/\//i, "https://");
    }

    // ===================================================
    // Relative backend path
    // Example:
    // /uploads/logos/google.png
    // ===================================================
    if (cleanLogo.startsWith("/")) {
      return `${API_URL}${cleanLogo}`;
    }

    // ===================================================
    // Relative path without /
    // Example:
    // uploads/logos/google.png
    // ===================================================
    return `${API_URL}/${cleanLogo}`;
  };

  const companyLogo = getLogoUrl(company?.logo);

  // =====================================================
  // UI
  // =====================================================
  return (
    <div
      onClick={handleClick}
      className="
        min-w-[180px]
        md:min-w-[210px]
        h-52
        bg-white
        shadow-lg
        rounded-xl
        p-5
        hover:-translate-y-1
        hover:shadow-2xl
        transition
        duration-300
        cursor-pointer
        group
      "
    >
      {/* =================================================
          LOGO
      ================================================= */}
      <div
        className="
          w-14
          h-14
          rounded-xl
          bg-gray-50
          border
          border-gray-200
          flex
          items-center
          justify-center
          overflow-hidden
          transition
          duration-300
          group-hover:border-purple-300
          group-hover:scale-105
        "
      >
        {companyLogo ? (
          <img
            src={companyLogo}
            alt={`${companyName} logo`}
            className="
              w-full
              h-full
              p-2
              object-contain
            "
            onError={(e) => {
              console.error(
                "COMPANY LOGO FAILED:",
                companyLogo
              );

              e.currentTarget.style.display = "none";

              if (e.currentTarget.nextElementSibling) {
                e.currentTarget.nextElementSibling.style.display =
                  "flex";
              }
            }}
          />
        ) : null}

        {/* =================================================
            FALLBACK
        ================================================= */}
        <div
          className={`${
            companyLogo ? "hidden" : "flex"
          } w-full h-full items-center justify-center`}
        >
          <span className="text-2xl font-bold text-purple-600">
            {companyName.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      {/* =================================================
          COMPANY NAME
      ================================================= */}
      <h3
        className="
          mt-5
          font-bold
          text-gray-900
          group-hover:text-purple-600
          transition
        "
      >
        {companyName}
      </h3>

      {/* =================================================
          JOBS
      ================================================= */}
      <p
        className="
          flex
          items-center
          gap-2
          text-sm
          text-gray-500
          mt-2
        "
      >
        <FaBriefcase className="text-purple-600" />

        {company?.jobs !== undefined
          ? company.jobs
          : company?.jobsCount !== undefined
          ? company.jobsCount
          : 0}{" "}
        Jobs
      </p>

      {/* =================================================
          VIEW COMPANY
      ================================================= */}
      <div
        className="
          flex
          items-center
          gap-2
          text-purple-600
          text-sm
          font-medium
          mt-3
          opacity-0
          group-hover:opacity-100
          transition
        "
      >
        View Company

        <FaArrowRight className="text-xs" />
      </div>
    </div>
  );
};

export default CompanyCard;