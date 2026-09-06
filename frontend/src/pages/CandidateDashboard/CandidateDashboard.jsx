import {
  FaBriefcase,
  FaBookmark,
  FaFileAlt,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChartLine,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaVideo,
  FaArrowRight,
  FaComments,
  FaExclamationCircle,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../../api/api";

const CandidateDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

const [profile, setProfile] = useState({
  name: "",
  email: "",
  profileImage: "",
});


const getProfileImageUrl = (imagePath) => {
  if (!imagePath) return "";

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  const baseURL =
    API.defaults?.baseURL ||
    "http://localhost:5000/api";

  const backendURL = baseURL.replace(/\/api\/?$/, "");

  return `${backendURL}${imagePath}`;
};


  const [interviews, setInterviews] = useState([]);
  const [interviewLoading, setInterviewLoading] = useState(true);

  const navigate = useNavigate();

  // ==========================
  // Logout
  // ==========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==========================
  // Fetch Candidate Interviews
  // ==========================

  useEffect(() => {

    const fetchInterviews = async () => {
      try {
        setInterviewLoading(true);

        const response = await API.get("/interviews/candidate");

        setInterviews(response.data.interviews || []);
      } catch (error) {
        console.error(
          "Candidate Interviews Error:",
          error
        );

        setInterviews([]);
      } finally {
        setInterviewLoading(false);
      }
    };

   
    fetchInterviews();
  }, []);



  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await API.get("/users/profile");

      console.log("Dashboard Profile:", response.data);

      const user = response.data.user || response.data;

      setProfile({
        name: user.name || "",
        email: user.email || "",
        profileImage: user.profileImage || "",
      });
    } catch (error) {
      console.error("Candidate Profile Error:", error);
    }
  };

  fetchProfile();
}, []);

  // ==========================
  // Stats
  // ==========================

  const stats = [
    {
      title: "Applied Jobs",
      value: "24",
      icon: <FaFileAlt />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Saved Jobs",
      value: "12",
      icon: <FaBookmark />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Interviews",
      value: interviews.length,
      icon: <FaCalendarAlt />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Profile Views",
      value: "86",
      icon: <FaChartLine />,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  // ==========================
  // Applications
  // ==========================
const applications = [
  {
    company: "Google",
    job: "Frontend Developer",
    location: "Lahore, Pakistan",
    status: "Interview",
    date: "2 days ago",
    logo: "http://localhost:5000/uploads/logos/google.png",
  },
  {
    company: "Microsoft",
    job: "React Developer",
    location: "Karachi, Pakistan",
    status: "Applied",
    date: "4 days ago",
    logo: "http://localhost:5000/uploads/logos/microsoft.png",
  },
  {
    company: "Airhub",
    job: "UI/UX Designer",
    location: "Islamabad, Pakistan",
    status: "Shortlisted",
    date: "6 days ago",
    logo: "http://localhost:5000/uploads/logos/airhub.png",
  },
  {
    company: "Netflix",
    job: "Backend Developer",
    location: "Remote, Pakistan",
    status: "Rejected",
    date: "8 days ago",
    logo: "http://localhost:5000/uploads/logos/netflix.png",
  },
];

  // ==========================
  // Recommended Jobs
  // ==========================

  const recommendedJobs = [
    {
      company: "Google",
      title: "Frontend Developer",
      location: "Lahore, Pakistan",
      salary: "PKR 120,000 - 180,000",
      type: "Full Time",
      mode: "Onsite",
      logo: "/uploads/logos/google.png",
      logoBg: "bg-blue-100 text-blue-600",
    },
    {
      company: "Microsoft",
      title: "React Developer",
      location: "Karachi, Pakistan",
      salary: "PKR 150,000 - 220,000",
      type: "Full Time",
      mode: "Remote",
      logo: "/uploads/logos/microsoft.png",
      logoBg: "bg-green-100 text-green-600",
    },
    {
      company: "Fiverr",
      title: "Product Designer",
      location: "Islamabad, Pakistan",
      salary: "PKR 100,000 - 160,000",
      type: "Full Time",
      mode: "Remote",
      logo: "/uploads/logos/fiver.png",
      logoBg: "bg-green-100 text-green-700",
    },
  ];

  // ==========================
  // Format Date
  // ==========================

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================
  // Interview Type
  // ==========================

  const getInterviewIcon = (type) => {
    if (type === "Online") {
      return <FaVideo className="text-green-500" />;
    }

    return <FaMapMarkerAlt className="text-purple-500" />;
  };

  // ==========================
  // Interview Status
  // ==========================

  const getInterviewStatusStyle = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-green-100 text-green-700";

      case "Completed":
        return "bg-blue-100 text-blue-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= MOBILE HEADER ================= */}

      <div className="lg:hidden bg-[#070B2B] text-white px-4 py-4 flex items-center justify-between">

        <Link to="/candidate-dashboard">
          <h1 className="text-xl font-bold">
            Career
            <span className="text-purple-500">
              Connect
            </span>
          </h1>
        </Link>

        <button
          type="button"
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
          className="text-xl"
        >
          {sidebarOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>

      </div>


      {/* ================= OVERLAY ================= */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        ></div>
      )}


      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
          fixed top-0 left-0 z-40
          w-64 h-screen
          bg-[#070B2B] text-white
          flex flex-col
          transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >

        {/* Logo */}

        <div className="h-20 flex items-center px-6 border-b border-white/10">

          <Link to="/candidate-dashboard">

            <h1 className="text-2xl font-bold">
              Career
              <span className="text-purple-500">
                Connect
              </span>
            </h1>

          </Link>

        </div>


        {/* Profile */}

        <div className="px-5 py-6 border-b border-white/10">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center text-lg font-bold shrink-0">
  {profile.profileImage ? (
    <img
      src={getProfileImageUrl(profile.profileImage)}
      alt={profile.name || "Profile"}
      className="w-full h-full object-cover"
      onError={(e) => {
        console.error(
          "SIDEBAR PROFILE IMAGE FAILED:",
          getProfileImageUrl(profile.profileImage)
        );
        e.currentTarget.style.display = "none";
      }}
    />
  ) : (
    profile.name?.charAt(0)?.toUpperCase() || "A"
  )}
</div>

            <div>

              <h3 className="font-semibold">
                {profile.name || "Asad Usman"}
              </h3>

              <p className="text-xs text-gray-400">
                Candidate
              </p>

            </div>

          </div>

        </div>


        {/* ================= NAVIGATION ================= */}

        <nav className="flex-1 px-4 py-6 overflow-y-auto">

          <p className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-3">
            Main Menu
          </p>

          <div className="space-y-2">

            <Link
              to="/candidate-dashboard"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600 text-white"
            >
              <FaChartLine />
              Dashboard
            </Link>


            <Link
              to="/jobs"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-purple-400 transition"
            >
              <FaBriefcase />
              Browse Jobs
            </Link>


            <Link
              to="/candidate-applications"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-purple-400 transition"
            >
              <FaFileAlt />
              My Applications
            </Link>


            <Link
              to="/saved-jobs"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-purple-400 transition"
            >
              <FaBookmark />
              Saved Jobs
            </Link>


            <Link
              to="/messages"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-purple-400 transition"
            >
              <FaComments />
              Messages
            </Link>

          </div>


          {/* ================= ACCOUNT ================= */}

          <p className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-3 mt-8">
            Account
          </p>

          <div className="space-y-2">

            <Link
              to="/candidate-profile"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-purple-400 transition"
            >
              <FaUser />
              My Profile
            </Link>


            <Link
              to="/candidate-settings"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-purple-400 transition"
            >
              <FaCog />
              Settings
            </Link>

          </div>

        </nav>


        {/* ================= LOGOUT ================= */}

        <div className="p-4 border-t border-white/10">

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="lg:ml-64">

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

          {/* ================= WELCOME ================= */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

            <div>

              <p className="text-gray-500 text-sm">
                Tuesday, August 18, 2026
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                Welcome back, Asad! 👋
              </h1>

              <p className="text-gray-500 mt-2">
                Here's what's happening with your job search.
              </p>

            </div>

            <Link
              to="/jobs"
              className="inline-block bg-purple-600 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg transition text-center"
            >
              Browse Jobs
            </Link>

          </div>


          {/* ================= STATS ================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {stats.map((stat) => (

              <div
                key={stat.title}
                className="bg-white rounded-xl shadow-lg p-5"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-gray-500">
                      {stat.title}
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </h2>

                  </div>

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${stat.iconBg} ${stat.iconColor}`}
                  >
                    {stat.icon}
                  </div>

                </div>

              </div>

            ))}

          </div>


          {/* ================= APPLICATIONS + PROFILE ================= */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

            {/* Recent Applications */}

            <div className="xl:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">

              <div className="flex items-center justify-between p-5 border-b">

                <div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Recent Applications
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Track your latest job applications
                  </p>

                </div>

                <Link
                  to="/candidate-applications"
                  className="text-sm text-purple-600 font-medium hover:text-purple-800"
                >
                  View All
                </Link>

              </div>


              <div className="divide-y">

                {applications.map(
                  (application) => (

                    <div
                      key={`${application.company}-${application.job}`}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >

                      <div className="flex items-center gap-4">

                        
<div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
  <img
    src={application.logo}
    alt={application.company}
    className="w-full h-full object-contain p-2"
    onError={(e) => {
      console.error(
        "RECENT APPLICATION LOGO FAILED:",
        application.logo
      );

      e.currentTarget.style.display = "none";
      e.currentTarget.parentElement.innerHTML =
        '<span class="text-purple-600 text-lg">💼</span>';
    }}
  />
</div>


                        <div>

                          <h3 className="font-semibold text-gray-900">
                            {application.job}
                          </h3>

                          <p className="text-sm text-gray-600">
                            {application.company}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {application.location}
                          </p>

                        </div>

                      </div>


                      <div className="sm:text-right">

                        <span
                          className={`
                            inline-flex items-center gap-1
                            px-3 py-1 rounded-full text-xs font-medium
                            ${
                              application.status ===
                              "Interview"
                                ? "bg-blue-100 text-blue-600"
                                : application.status ===
                                  "Shortlisted"
                                ? "bg-green-100 text-green-600"
                                : application.status ===
                                  "Rejected"
                                ? "bg-red-100 text-red-600"
                                : "bg-yellow-100 text-yellow-600"
                            }
                          `}
                        >

                          {application.status ===
                            "Interview" && (
                            <FaCalendarAlt />
                          )}

                          {application.status ===
                            "Shortlisted" && (
                            <FaCheckCircle />
                          )}

                          {application.status ===
                            "Applied" && (
                            <FaClock />
                          )}

                          {application.status ===
                            "Rejected" && (
                            <FaTimes />
                          )}

                          {application.status}

                        </span>

                        <p className="text-xs text-gray-400 mt-2">
                          {application.date}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* PROFILE COMPLETION */}

            <div className="bg-white rounded-xl shadow-lg p-6">

              <h2 className="text-lg font-bold text-gray-900">
                Profile Completion
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Complete your profile to get noticed by recruiters.
              </p>


              <div className="flex justify-center py-7">

                <div className="w-32 h-32 rounded-full border-8 border-purple-100 flex items-center justify-center">

                  <div className="text-center">

                    <h3 className="text-2xl font-bold text-gray-900">
                      75%
                    </h3>

                    <p className="text-xs text-gray-500">
                      Complete
                    </p>

                  </div>

                </div>

              </div>


              <div className="space-y-3">

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Profile Photo
                  </span>
                  <FaCheckCircle className="text-green-500" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Personal Information
                  </span>
                  <FaCheckCircle className="text-green-500" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Skills
                  </span>
                  <FaCheckCircle className="text-green-500" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Resume
                  </span>
                  <FaClock className="text-yellow-500" />
                </div>

              </div>


              <Link
                to="/candidate-profile"
                className="block text-center w-full mt-6 border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white py-2.5 rounded-lg transition"
              >
                Complete Profile
              </Link>

            </div>

          </div>


          {/* ================= RECOMMENDED JOBS + INTERVIEWS ================= */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

            {/* Recommended Jobs */}

            <div className="xl:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">

              <div className="flex items-center justify-between p-5 border-b">

                <div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Recommended Jobs
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Jobs that match your skills and profile
                  </p>

                </div>

                <Link
                  to="/jobs"
                  className="text-sm text-purple-600 font-medium hover:text-purple-800 flex items-center gap-1"
                >
                  View All
                  <FaArrowRight className="text-xs" />
                </Link>

              </div>


              <div className="divide-y">

                {recommendedJobs.map(
                  (job) => (

                    <div
                      key={`${job.company}-${job.title}`}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:bg-gray-50 transition"
                    >

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
  {job.logo ? (
    <img
      src={
        job.logo.startsWith("http")
          ? job.logo
          : `http://localhost:5000${job.logo}`
      }
      alt={job.company}
      className="w-full h-full object-contain p-2"
      onError={(e) => {
        console.error(
          "RECOMMENDED JOB LOGO FAILED:",
          `http://localhost:5000${job.logo}`
        );

        e.currentTarget.style.display = "none";

        const fallback =
          e.currentTarget.parentElement.querySelector(
            ".recommended-logo-fallback"
          );

        if (fallback) {
          fallback.classList.remove("hidden");
          fallback.classList.add("flex");
        }
      }}
    />
  ) : null}

  <div
    className={`recommended-logo-fallback ${
      job.logo ? "hidden" : "flex"
    } w-full h-full items-center justify-center bg-purple-100 text-purple-600 text-lg font-bold`}
  >
    {job.company?.charAt(0)?.toUpperCase() || "C"}
  </div>
</div>

                        <div>

                          <h3 className="font-semibold text-gray-900">
                            {job.title}
                          </h3>

                          <p className="text-sm text-gray-600">
                            {job.company}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 mt-2">

                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <FaMapMarkerAlt className="text-purple-500" />
                              {job.location}
                            </span>

                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <FaMoneyBillWave className="text-green-500" />
                              {job.salary}
                            </span>

                          </div>

                        </div>

                      </div>


                      <div className="flex items-center gap-3 sm:flex-col lg:flex-row">

                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-medium">
                          {job.type}
                        </span>

                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                          {job.mode}
                        </span>

                        <button
                          type="button"
                          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-purple-600 hover:border-purple-500 transition"
                        >
                          <FaBookmark />
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* ================= UPCOMING INTERVIEWS ================= */}

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">

              <div className="p-5 border-b">

                <h2 className="text-lg font-bold text-gray-900">
                  Upcoming Interviews
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Your scheduled interviews
                </p>

              </div>


              <div className="p-5 space-y-5">

                {interviewLoading ? (

                  <div className="py-8 text-center">

                    <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>

                    <p className="text-sm text-gray-500 mt-3">
                      Loading interviews...
                    </p>

                  </div>

                ) : interviews.length === 0 ? (

                  <div className="py-8 text-center">

                    <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto text-xl">
                      <FaCalendarAlt />
                    </div>

                    <h3 className="font-semibold text-gray-700 mt-4">
                      No Interviews Scheduled
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Your scheduled interviews will appear here.
                    </p>

                  </div>

                ) : (

                  interviews.map(
                    (interview) => {

                      const job =
                        interview.job || {};

                      const recruiter =
                        interview.recruiter || {};

                      return (
                        <div
                          key={interview._id}
                          className="border border-gray-100 rounded-xl p-4"
                        >

                          {/* Interview Header */}

                          <div className="flex items-start justify-between gap-3">

                            <div className="flex items-center gap-3 min-w-0">
                      

<div className="w-11 h-11 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">

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
            "CANDIDATE INTERVIEW LOGO FAILED:",
            `http://localhost:5000${job.company.logo}`
          );

          e.currentTarget.style.display = "none";

          const fallback =
            e.currentTarget.parentElement.querySelector(
              ".candidate-interview-logo-fallback"
            );

          if (fallback) {
            fallback.classList.remove("hidden");
            fallback.classList.add("flex");
          }
        }}
      />
    ) : null}

    <div
      className={`candidate-interview-logo-fallback ${
        job?.company?.logo ? "hidden" : "flex"
      } w-full h-full items-center justify-center bg-purple-100 text-purple-600 font-bold`}
    >
      {job?.company?.name?.charAt(0)?.toUpperCase() || "C"}
    </div>

  </div>


                              <div className="min-w-0">

                                <h3 className="font-semibold text-gray-900 text-sm break-words">
                                  {job.title ||
                                    "Job Interview"}
                                </h3>

                                <p className="text-xs text-gray-500 break-all">
                                  {recruiter.name ||
                                    recruiter.email ||
                                    "Recruiter"}
                                </p>

                              </div>

                            </div>

                            <span
                              className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium ${getInterviewStatusStyle(
                                interview.status
                              )}`}
                            >
                              {interview.status}
                            </span>

                          </div>


                          {/* Interview Details */}

                          <div className="mt-4 space-y-2">

                            <p className="flex items-start gap-2 text-sm text-gray-600">

                              <FaCalendarAlt className="text-purple-500 mt-0.5 shrink-0" />

                              <span>
                                {formatDate(
                                  interview.date
                                )}
                              </span>

                            </p>


                            <p className="flex items-start gap-2 text-sm text-gray-600">

                              <FaClock className="text-blue-500 mt-0.5 shrink-0" />

                              <span>
                                {interview.time ||
                                  "Time not available"}
                              </span>

                            </p>


                            <p className="flex items-start gap-2 text-sm text-gray-600">

                              {getInterviewIcon(
                                interview.type
                              )}

                              <span>
                                {interview.type ||
                                  "Online"}
                              </span>

                            </p>


                            {/* Location */}

                            {interview.type ===
                              "In-Person" &&
                              interview.location && (
                                <p className="flex items-start gap-2 text-sm text-gray-600">

                                  <FaMapMarkerAlt className="text-red-500 mt-0.5 shrink-0" />

                                  <span className="break-words">
                                    {interview.location}
                                  </span>

                                </p>
                              )}


                            {/* Meeting Link */}

                            {interview.type ===
                              "Online" &&
                              interview.meetingLink && (
                                <a
                                  href={
                                    interview.meetingLink
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-medium"
                                >
                                  <FaVideo />
                                  Join Interview
                                </a>
                              )}

                          </div>


                          {/* Notes */}

                          {interview.notes && (
                            <div className="mt-4 bg-gray-50 rounded-lg p-3">

                              <p className="text-xs font-semibold text-gray-700 mb-1">
                                Interview Notes
                              </p>

                              <p className="text-xs text-gray-500 leading-5 break-words">
                                {interview.notes}
                              </p>

                            </div>
                          )}

                        </div>
                      );
                    }
                  )

                )}

              </div>

            </div>

          </div>


          {/* ================= INTERVIEW NOTICE ================= */}

          {interviews.some(
            (interview) =>
              interview.status === "Scheduled"
          ) && (
            <div className="mt-6 bg-purple-50 border border-purple-100 rounded-xl p-4 sm:p-5">

              <div className="flex items-start gap-3">

                <FaExclamationCircle className="text-purple-600 mt-1 shrink-0" />

                <div>

                  <h3 className="font-semibold text-purple-800">
                    You have a scheduled interview
                  </h3>

                  <p className="text-sm text-purple-700 mt-1">
                    Please make sure you are available at the scheduled date and time. Check the interview type and meeting details above.
                  </p>

                </div>

              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
};

export default CandidateDashboard;