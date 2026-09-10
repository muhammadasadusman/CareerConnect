import {
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
} from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

// =====================================================
// BACKEND BASE URL
// =====================================================
// Production:
// VITE_API_URL = https://careerconnect.dockhosting.dev/api
//
// Local development:
// VITE_API_URL = http://localhost:5000/api
// =====================================================
const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

// =====================================================
// Convert backend image path into complete URL
// =====================================================
const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") {
    return null;
  }

  const cleanPath = imagePath.trim();

  if (!cleanPath) {
    return null;
  }

  // HTTPS URL
  if (cleanPath.startsWith("https://")) {
    return cleanPath;
  }

  // Old HTTP URL -> HTTPS
  if (cleanPath.startsWith("http://")) {
    return cleanPath.replace(/^http:\/\//i, "https://");
  }

  // Backend path:
  // /uploads/job-logos/react.png
  if (cleanPath.startsWith("/")) {
    return `${API_URL}${cleanPath}`;
  }

  // Backend path without leading slash:
  // uploads/job-logos/react.png
  return `${API_URL}/${cleanPath}`;
};

// =====================================================
// JOB CARD
// =====================================================
const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const [showLoginCard, setShowLoginCard] = useState(false);
  const [showApplyCard, setShowApplyCard] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  console.log("JOB CARD DATA:", job);

  // ===================================================
  // COMPANY NAME
  // ===================================================
  const companyName =
    typeof job?.company === "string"
      ? job.company
      : job?.company?.name || "Company";

  // ===================================================
  // JOB IMAGE
  // ===================================================
  const jobImage = getImageUrl(
    job?.image || job?.jobLogo
  );

  // ===================================================
  // COMPANY LOGO
  // ===================================================
  let companyLogo = null;

  if (
    job?.company &&
    typeof job.company === "object" &&
    job.company.logo
  ) {
    companyLogo = getImageUrl(job.company.logo);
  }

  // ===================================================
  // COMPANY LOGO FALLBACK
  // ===================================================
  if (!companyLogo) {
    const name = companyName.toLowerCase();

    if (name.includes("google")) {
      companyLogo = `${API_URL}/uploads/logos/google.png`;
    } else if (name.includes("microsoft")) {
      companyLogo = `${API_URL}/uploads/logos/microsoft.png`;
    } else if (name.includes("airhub")) {
      companyLogo = `${API_URL}/uploads/logos/airhub.png`;
    } else if (name.includes("netflix")) {
      companyLogo = `${API_URL}/uploads/logos/netflix.png`;
    } else if (name.includes("twilio")) {
      companyLogo = `${API_URL}/uploads/logos/twilio.png`;
    } else if (
      name.includes("fiverr") ||
      name.includes("fiver")
    ) {
      companyLogo = `${API_URL}/uploads/logos/fiver.png`;
    } else if (name.includes("careerconnect")) {
      companyLogo = `${API_URL}/uploads/logos/careerconnect.png`;
    }
  }

  // ===================================================
  // CHECK LOGIN
  // ===================================================
  const handleApplyClick = async () => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token || !userString) {
      setShowLoginCard(true);
      setShowApplyCard(false);
      return;
    }

    let user;

    try {
      user = JSON.parse(userString);
    } catch (error) {
      console.error("User JSON Error:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setShowLoginCard(true);
      return;
    }

    if (user?.role && user.role !== "candidate") {
      setMessage(
        "Only candidate accounts can apply for jobs."
      );
      setMessageType("error");
      setShowApplyCard(true);
      return;
    }

    if (!job?._id) {
      setMessage(
        "This featured job does not have a backend Job ID yet. Please open the Jobs page and apply from there."
      );
      setMessageType("error");
      setShowApplyCard(true);
      return;
    }

    setMessage("");
    setMessageType("");
    setShowLoginCard(false);
    setShowApplyCard(true);
  };

  // ===================================================
  // SUBMIT APPLICATION
  // ===================================================
  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setShowApplyCard(false);
      setShowLoginCard(true);
      return;
    }

    if (!job?._id) {
      setMessage(
        "Job ID is missing. Please apply from the Jobs page."
      );
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      const response = await API.post(
        "/applications/apply",
        {
          job: job._id,
          coverLetter: coverLetter.trim(),
        }
      );

      console.log(
        "APPLICATION SUCCESS:",
        response.data
      );

      setMessage(
        response.data?.message ||
          "Job application submitted successfully!"
      );

      setMessageType("success");
      setCoverLetter("");

      setTimeout(() => {
        setShowApplyCard(false);
        setMessage("");
        setMessageType("");
      }, 1800);
    } catch (error) {
      console.error(
        "APPLICATION ERROR:",
        error
      );

      const errorMessage =
        error.response?.data?.message ||
        "Failed to apply for this job.";

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // LOGIN NOW
  // ===================================================
  const handleLogin = () => {
    setShowLoginCard(false);
    navigate("/login");
  };

  // ===================================================
  // UI
  // ===================================================
  return (
    <>
      {/* =================================================
          JOB CARD
      ================================================= */}
      <div
        className="
          group
          relative
          bg-white
          rounded-2xl
          shadow-md
          overflow-hidden
          border
          border-gray-100

          transition-all
          duration-500
          ease-out

          hover:-translate-y-3
          hover:scale-[1.015]
          hover:border-purple-300
          hover:shadow-[0_20px_45px_rgba(124,58,237,0.18)]

          animate-[fadeInUp_0.6s_ease-out]
        "
      >
        {/* =================================================
            TOP PURPLE GLOW LINE
        ================================================= */}
        <div
          className="
            absolute
            top-0
            left-0
            right-0
            h-1
            bg-gradient-to-r
            from-purple-500
            via-violet-500
            to-fuchsia-500
            opacity-0
            group-hover:opacity-100
            transition-opacity
            duration-500
            z-20
          "
        />

        {/* =================================================
            JOB IMAGE
        ================================================= */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
          {jobImage ? (
            <img
              src={jobImage}
              alt={job?.title || "Job image"}
              className="
                w-full
                h-full
                object-cover
                object-center

                transition-transform
                duration-700
                ease-out

                group-hover:scale-110
              "
              onError={(e) => {
                console.error(
                  "JOB IMAGE FAILED:",
                  jobImage
                );

                e.currentTarget.style.display =
                  "none";

                if (
                  e.currentTarget
                    .nextElementSibling
                ) {
                  e.currentTarget.nextElementSibling.style.display =
                    "flex";
                }
              }}
            />
          ) : null}

          {/* JOB IMAGE FALLBACK */}
          <div
            className={`${
              jobImage ? "hidden" : "flex"
            } w-full h-full items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100`}
          >
            <span className="text-purple-600 font-semibold text-center px-4">
              {job?.title || "Job"}
            </span>
          </div>

          {/* IMAGE DARK OVERLAY */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-purple-950/40
              via-transparent
              to-transparent

              opacity-0
              group-hover:opacity-100

              transition-opacity
              duration-500
            "
          />

          {/* IMAGE SHINE */}
          <div
            className="
              absolute
              inset-y-0
              -left-1/2
              w-1/3

              bg-white/20
              skew-x-[-20deg]

              transition-all
              duration-700

              group-hover:left-[120%]
            "
          />
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}
        <div className="p-6">

          {/* =================================================
              COMPANY
          ================================================= */}
          <div className="flex items-center gap-4">

            {/* COMPANY LOGO */}
            <div
              className="
                w-12
                h-12
                rounded-full
                bg-gray-50
                border
                border-gray-200
                flex
                items-center
                justify-center
                overflow-hidden
                shrink-0

                transition-all
                duration-500

                group-hover:border-purple-300
                group-hover:bg-purple-50
                group-hover:shadow-[0_0_18px_rgba(124,58,237,0.20)]
                group-hover:scale-110
                group-hover:rotate-3
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

                    transition-transform
                    duration-500

                    group-hover:scale-110
                  "
                  onError={(e) => {
                    console.error(
                      "COMPANY LOGO FAILED:",
                      companyLogo
                    );

                    e.currentTarget.style.display =
                      "none";

                    if (
                      e.currentTarget
                        .nextElementSibling
                    ) {
                      e.currentTarget.nextElementSibling.style.display =
                        "flex";
                    }
                  }}
                />
              ) : null}

              {/* COMPANY LOGO FALLBACK */}
              <div
                className={`${
                  companyLogo ? "hidden" : "flex"
                } w-full h-full items-center justify-center`}
              >
                <span className="text-lg font-bold text-purple-600">
                  {companyName
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
            </div>

            {/* COMPANY INFO */}
            <div className="min-w-0">
              <h3
                className="
                  font-semibold
                  text-gray-900

                  group-hover:text-purple-600

                  transition-all
                  duration-300
                "
              >
                {companyName}
              </h3>

              <p className="text-sm text-gray-500">
                {job?.jobType ||
                  job?.type ||
                  job?.time ||
                  "Full Time"}
              </p>
            </div>
          </div>

          {/* =================================================
              JOB TITLE
          ================================================= */}
          <h2
            className="
              text-lg
              font-bold
              text-gray-900
              mt-5

              transition-all
              duration-300

              group-hover:text-purple-600
              group-hover:translate-x-1
            "
          >
            {job?.title || "Untitled Job"}
          </h2>

          {/* =================================================
              JOB DETAILS
          ================================================= */}
          <div className="mt-4 space-y-3 text-sm text-gray-600">

            {/* LOCATION */}
            <p
              className="
                flex
                items-center
                gap-2
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              <FaMapMarkerAlt className="text-purple-600 shrink-0" />

              <span>
                {job?.location ||
                  "Location not specified"}
              </span>
            </p>

            {/* SALARY */}
            <p
              className="
                flex
                items-center
                gap-2
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              <FaMoneyBillWave className="text-green-600 shrink-0" />

              <span>
                {job?.salary ||
                  "Salary not specified"}
              </span>
            </p>

            {/* JOB TYPE */}
            <p
              className="
                flex
                items-center
                gap-2
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              <FaClock className="text-blue-600 shrink-0" />

              <span>
                {job?.jobType ||
                  job?.type ||
                  "Full Time"}
              </span>
            </p>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}
          <div className="flex justify-between items-center mt-6">

            <span
              className="
                text-xs
                text-gray-500
                transition-colors
                duration-300
                group-hover:text-purple-500
              "
            >
              {job?.posted || "Recently posted"}
            </span>

            {/* APPLY BUTTON */}
            <button
              type="button"
              onClick={handleApplyClick}
              className="
                group/button

                flex
                items-center
                gap-2

                bg-purple-600
                hover:bg-yellow-500
                hover:text-gray-900

                text-white
                px-4
                py-2
                rounded-lg

                text-sm
                font-medium

                transition-all
                duration-300

                hover:scale-105
                hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)]
                active:scale-95
              "
            >
              <span>Apply Now</span>

              <FaArrowRight
                className="
                  text-xs
                  transition-transform
                  duration-300
                  group-hover/button:translate-x-1
                "
              />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          LOGIN REQUIRED CARD
      ===================================================== */}
      {showLoginCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-7 animate-[fadeInUp_0.3s_ease-out]">

            <button
              type="button"
              onClick={() =>
                setShowLoginCard(false)
              }
              className="
                absolute
                top-4
                right-4
                text-gray-400
                hover:text-gray-700
                hover:rotate-90
                transition-all
                duration-300
              "
            >
              <FaTimes />
            </button>

            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                <FaExclamationTriangle className="text-yellow-600 text-2xl" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 text-center">
              Login Required
            </h2>

            <p className="text-gray-500 text-center mt-2 leading-6">
              Please login to your CareerConnect account
              before applying for this job.
            </p>

            <div className="flex gap-3 mt-6">

              <button
                type="button"
                onClick={() =>
                  setShowLoginCard(false)
                }
                className="
                  flex-1
                  border
                  border-gray-200
                  text-gray-600
                  py-3
                  rounded-lg
                  font-medium
                  hover:bg-gray-50
                  transition-all
                  duration-300
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogin}
                className="
                  flex-1
                  bg-purple-600
                  hover:bg-yellow-500
                  hover:text-gray-900
                  text-white
                  py-3
                  rounded-lg
                  font-medium
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                "
              >
                Login Now
              </button>

            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          APPLY CARD
      ===================================================== */}
      {showApplyCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-7 animate-[fadeInUp_0.3s_ease-out]">

            {/* CLOSE */}
            <button
              type="button"
              onClick={() => {
                if (!loading) {
                  setShowApplyCard(false);
                  setMessage("");
                }
              }}
              disabled={loading}
              className="
                absolute
                top-4
                right-4
                text-gray-400
                hover:text-gray-700
                hover:rotate-90
                disabled:opacity-50
                transition-all
                duration-300
              "
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold text-gray-900">
              Apply for Job
            </h2>

            <p className="text-gray-500 mt-1">
              {job?.title || "Job"}
            </p>

            <p className="text-sm text-purple-600 mt-1">
              {companyName}
            </p>

            {/* MESSAGE */}
            {message && (
              <div
                className={`mt-5 rounded-lg px-4 py-3 text-sm border ${
                  messageType === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                <div className="flex items-start gap-2">
                  {messageType === "success" ? (
                    <FaCheckCircle className="mt-0.5 shrink-0" />
                  ) : (
                    <FaExclamationTriangle className="mt-0.5 shrink-0" />
                  )}

                  <span>{message}</span>
                </div>
              </div>
            )}

            {/* APPLY FORM */}
            {!(
              message &&
              messageType === "error" &&
              !job?._id
            ) && (
              <form
                onSubmit={handleSubmitApplication}
                className="mt-6"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                  <span className="text-gray-400 font-normal">
                    {" "}
                    (Optional)
                  </span>
                </label>

                <textarea
                  value={coverLetter}
                  onChange={(e) =>
                    setCoverLetter(e.target.value)
                  }
                  rows="5"
                  placeholder="Write a short cover letter..."
                  disabled={loading}
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-lg
                    px-4
                    py-3
                    text-gray-700
                    outline-none
                    resize-none

                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-100

                    transition-all
                    duration-300
                  "
                />

                <div className="flex gap-3 mt-5">

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setShowApplyCard(false)
                    }
                    className="
                      flex-1
                      border
                      border-gray-200
                      text-gray-600
                      py-3
                      rounded-lg
                      font-medium
                      hover:bg-gray-50
                      disabled:opacity-50
                      transition-all
                      duration-300
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      flex-1
                      bg-purple-600
                      hover:bg-yellow-500
                      hover:text-gray-900
                      text-white
                      py-3
                      rounded-lg
                      font-medium
                      disabled:opacity-60

                      transition-all
                      duration-300

                      hover:scale-[1.02]
                      hover:shadow-lg
                    "
                  >
                    {loading
                      ? "Applying..."
                      : "Submit Application"}
                  </button>

                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default JobCard;