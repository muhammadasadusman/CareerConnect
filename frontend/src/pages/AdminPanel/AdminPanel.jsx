import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Reports from "./Reports";
import {
  FaBars,
  FaTimes,
  FaChartLine,
  FaUsers,
  FaBriefcase,
  FaBuilding,
  FaFileAlt,
  FaFlag,
  FaSignOutAlt,
  FaUserShield,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaArrowRight,
  FaPlus,
  FaTrash,
  FaSyncAlt,
  FaEye,
  FaExclamationTriangle,
  FaIndustry,
  FaCog,
  FaBell,
  FaLock,
  FaEyeSlash,
  FaCamera,
} from "react-icons/fa";


import API from "../../api/api";

const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") return "";

  const value = imagePath.trim();
  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  const baseUrl =
    API?.defaults?.baseURL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  const backendOrigin = baseUrl.replace(/\/api\/?$/, "");

  return `${backendOrigin}${value.startsWith("/") ? value : `/${value}`}`;
};

const CompanyLogo = ({
  src,
  name = "Company",
  className = "w-12 h-12",
}) => {
  const [imageError, setImageError] = useState(false);

  const logoUrl = getImageUrl(src);

  if (!logoUrl || imageError) {
    return (
      <div
        className={`${className} rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0 overflow-hidden`}
      >
        {(name || "C").charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div
      className={`${className} rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden`}
    >
      <img
        src={logoUrl}
        alt={name || "Company"}
        className="w-full h-full object-contain p-1.5"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

const AdminPanel = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    candidates: 0,
    recruiters: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
  });

  const [recentJobs, setRecentJobs] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [applicationsError, setApplicationsError] = useState("");

  const [deleteLoading, setDeleteLoading] = useState(null);

  // =====================================================
  // SETTINGS STATE
  // =====================================================

  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const [settings, setSettings] = useState({
    jobAlerts: true,
    profileVisibility: "public",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);

  // =====================================================
  // CURRENT USER
  // =====================================================

  const storedUser = localStorage.getItem("user");

  let currentUser = null;

  try {
    currentUser = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    currentUser = null;
  }

  // ADMIN PROFILE IMAGE
  const [profileImage, setProfileImage] = useState(
    currentUser?.profileImage || ""
  );
  const [uploadingProfile, setUploadingProfile] = useState(false);

  // =====================================================
  // CHECK ADMIN LOGIN
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || currentUser?.role !== "admin") {
      navigate("/login");
    }
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =====================================================
  // UPLOAD ADMIN PROFILE IMAGE
  // =====================================================

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    try {
      setUploadingProfile(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await API.put(
        "/users/profile/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = response.data?.user;
      const newImage = updatedUser?.profileImage;

      if (!newImage) {
        throw new Error("Profile image was not returned by the server.");
      }

      setProfileImage(newImage);

      const oldUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const newUser = {
        ...oldUser,
        ...(updatedUser || {}),
        profileImage: newImage,
      };

      localStorage.setItem("user", JSON.stringify(newUser));

      setSuccess("Profile picture updated successfully!");
    } catch (err) {
      console.error("Profile Image Upload Error:", err);

      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload profile picture."
      );
    } finally {
      setUploadingProfile(false);
      e.target.value = "";
    }
  };

  // =====================================================
  // DASHBOARD STATS
  // =====================================================

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/admin/dashboard");

      if (response.data?.stats) {
        setDashboardStats(response.data.stats);
      }
    } catch (err) {
      console.error("Dashboard Stats Error:", err);

      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      if (err.response?.status === 403) {
        setError(
          "Access denied. Only administrators can access this panel."
        );
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);

      const response = await API.get("/admin/users");

      setRecentUsers(response.data?.users || []);
    } catch (err) {
      console.error("Users Error:", err);

      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setUsersLoading(false);
    }
  };

  // =====================================================
  // GET JOBS
  // =====================================================

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);

      const response = await API.get("/jobs");

      const jobs =
        response.data?.jobs ||
        response.data ||
        [];

      setRecentJobs(
        Array.isArray(jobs) ? jobs : []
      );
    } catch (err) {
      console.error("Jobs Error:", err);

      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load jobs."
      );
    } finally {
      setJobsLoading(false);
    }
  };

  // =====================================================
  // GET COMPANIES
  // =====================================================

  const fetchCompanies = async () => {
    try {
      setCompaniesLoading(true);

      const response = await API.get("/companies");

      const data =
        response.data?.companies ||
        response.data ||
        [];

      setCompanies(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error("Companies Error:", err);

      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load companies."
      );
    } finally {
      setCompaniesLoading(false);
    }
  };

  // =====================================================
  // GET APPLICATIONS
  // =====================================================

  const fetchApplications = async () => {
    try {
      setApplicationsLoading(true);
      setApplicationsError("");

      const response = await API.get(
        "/applications/admin"
      );

      console.log(
        "Admin Applications Response:",
        response.data
      );

      const data =
        response.data?.applications ||
        response.data ||
        [];

      setApplications(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Applications Error:",
        err
      );

      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      if (err.response?.status === 403) {
        setApplicationsError(
          "Access denied. Only administrators can view applications."
        );
        return;
      }

      setApplicationsError(
        err.response?.data?.message ||
          "Failed to load applications."
      );
    } finally {
      setApplicationsLoading(false);
    }
  };

  // =====================================================
  // GET SETTINGS
  // =====================================================

  const fetchSettings = async () => {
    try {
      setSettingsLoading(true);
      setError("");

      const response = await API.get(
        "/users/profile"
      );

      const user = response.data?.user;

      if (user) {
        setSettings({
          jobAlerts:
            user.jobAlerts !== undefined
              ? user.jobAlerts
              : true,

          profileVisibility:
            user.profileVisibility ||
            "public",
        });
      }
    } catch (err) {
      console.error(
        "Settings Error:",
        err
      );

      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load settings."
      );
    } finally {
      setSettingsLoading(false);
    }
  };

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  const loadDashboard = async () => {
    setError("");
    setSuccess("");

    await Promise.all([
      fetchDashboardStats(),
      fetchUsers(),
      fetchJobs(),
      fetchCompanies(),
    ]);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleNavigation = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
    setError("");
    setSuccess("");

    if (section === "settings") {
      fetchSettings();
    }

    if (section === "applications") {
      fetchApplications();
    }
  };

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSaveSettings = async () => {
    try {
      setSettingsSaving(true);
      setError("");
      setSuccess("");

      await API.put("/users/settings", {
        jobAlerts: settings.jobAlerts,
        profileVisibility:
          settings.profileVisibility,
      });

      setSuccess(
        "Settings saved successfully."
      );
    } catch (err) {
      console.error(
        "Save Settings Error:",
        err
      );

      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to save settings."
      );
    } finally {
      setSettingsSaving(false);
    }
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setError(
        "Please fill all password fields."
      );
      return;
    }

    if (
      passwordData.newPassword.length < 6
    ) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setError(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setPasswordLoading(true);

      await API.put(
        "/users/change-password",
        {
          currentPassword:
            passwordData.currentPassword,
          newPassword:
            passwordData.newPassword,
        }
      );

      setSuccess(
        "Password changed successfully."
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(
        "Change Password Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoading(`user-${id}`);
      setError("");
      setSuccess("");

      await API.delete(
        `/admin/users/${id}`
      );

      setRecentUsers((prev) =>
        prev.filter(
          (user) => user._id !== id
        )
      );

      setSuccess(
        "User deleted successfully."
      );

      await fetchDashboardStats();
    } catch (err) {
      console.error(
        "Delete User Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete user."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // =====================================================
  // DELETE JOB
  // =====================================================

  const handleDeleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoading(`job-${id}`);
      setError("");
      setSuccess("");

      await API.delete(
        `/admin/jobs/${id}`
      );

      setRecentJobs((prev) =>
        prev.filter(
          (job) => job._id !== id
        )
      );

      setSuccess(
        "Job deleted successfully."
      );

      await fetchDashboardStats();
    } catch (err) {
      console.error(
        "Delete Job Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete job."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // =====================================================
  // DELETE COMPANY
  // =====================================================

  const handleDeleteCompany = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoading(
        `company-${id}`
      );

      setError("");
      setSuccess("");

      await API.delete(
        `/admin/companies/${id}`
      );

      setCompanies((prev) =>
        prev.filter(
          (company) =>
            company._id !== id
        )
      );

      setSuccess(
        "Company deleted successfully."
      );

      await fetchDashboardStats();
    } catch (err) {
      console.error(
        "Delete Company Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete company."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // =====================================================
  // COMPANY DETAILS
  // =====================================================

  const handleCompanyClick = (id) => {
    navigate(`/companies/${id}`);
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const getCompanyObject = (jobOrCompany) => {
    const rawCompany =
      jobOrCompany?.company ??
      jobOrCompany?.companyId ??
      jobOrCompany;

    if (!rawCompany) return {};

    if (typeof rawCompany === "object") {
      return rawCompany;
    }

    const matchingCompany = companies.find(
      (company) =>
        String(company?._id || "") === String(rawCompany) ||
        String(company?.id || "") === String(rawCompany) ||
        String(company?.name || "").toLowerCase() ===
          String(rawCompany).toLowerCase() ||
        String(company?.companyName || "").toLowerCase() ===
          String(rawCompany).toLowerCase()
    );

    return matchingCompany || {};
  };

  const getCompanyName = (jobOrCompany) => {
    const company = getCompanyObject(jobOrCompany);

    return (
      company?.name ||
      company?.companyName ||
      (typeof jobOrCompany?.company === "string"
        ? jobOrCompany.company
        : typeof jobOrCompany === "string"
        ? jobOrCompany
        : "Company")
    );
  };

  const getCompanyLogo = (jobOrCompany) => {
    const company = getCompanyObject(jobOrCompany);

    return (
      company?.logo ||
      company?.logoUrl ||
      company?.image ||
      company?.imageUrl ||
      company?.companyLogo ||
      ""
    );
  };

  const getInitials = (name = "") => {
    return (
      name
        .split(" ")
        .filter(Boolean)
        .map(
          (word) => word[0]
        )
        .join("")
        .substring(0, 2)
        .toUpperCase() || "U"
    );
  };

  // =====================================================
  // DATE
  // =====================================================

  const today =
    new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );

  // =====================================================
  // STATS
  // =====================================================

  const stats = [
    {
      title: "Total Users",
      value:
        dashboardStats.totalUsers,
      icon: <FaUsers />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Active Jobs",
      value:
        dashboardStats.activeJobs,
      icon: <FaBriefcase />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Companies",
      value:
        dashboardStats.totalCompanies,
      icon: <FaBuilding />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Applications",
      value:
        dashboardStats.totalApplications,
      icon: <FaFileAlt />,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  // =====================================================
  // DASHBOARD
  // =====================================================

  const renderDashboard = () => {
    return (
      <>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-gray-500 text-sm">
              {today}
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {currentUser?.name ||
                "Admin"}{" "}
              Dashboard 👋
            </h1>

            <p className="text-gray-500 mt-2">
              Here's an overview of your
              CareerConnect platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={loadDashboard}
              className="flex items-center justify-center gap-2 border border-gray-200 bg-white hover:border-purple-500 hover:text-purple-600 text-gray-700 px-4 py-3 rounded-lg transition"
            >
              <FaSyncAlt
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>

            <button
              onClick={() =>
                handleNavigation("jobs")
              }
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg transition"
            >
              <FaPlus />
              Add Job
            </button>
          </div>
        </div>

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
                    {loading
                      ? "..."
                      : stat.value}
                  </h2>

                  <p className="text-xs text-green-600 mt-2 font-medium">
                    Live database data
                  </p>
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          <div className="xl:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Jobs
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Latest jobs posted on the
                  platform
                </p>
              </div>

              <button
                onClick={() =>
                  handleNavigation("jobs")
                }
                className="text-sm text-purple-600 font-medium hover:text-purple-800 flex items-center gap-1"
              >
                View All
                <FaArrowRight className="text-xs" />
              </button>
            </div>

            <div className="divide-y">
              {jobsLoading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading jobs...
                </div>
              ) : recentJobs.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No jobs found.
                </div>
              ) : (
                recentJobs
                  .slice(0, 5)
                  .map((job) => {
                    const companyName =
                      getCompanyName(job);

                    const status =
                      job.status ||
                      job.jobStatus ||
                      "Active";

                    return (
                      <div
                        key={job._id}
                        className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <CompanyLogo
                            src={getCompanyLogo(job)}
                            name={companyName}
                            className="w-12 h-12"
                          />

                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {job.title ||
                                "Untitled Job"}
                            </h3>

                            <p className="text-sm text-gray-600">
                              {companyName}
                            </p>

                            <div className="flex flex-wrap gap-3 mt-2">
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <FaMapMarkerAlt className="text-purple-500" />
                                {job.location ||
                                  "Not specified"}
                              </span>

                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <FaMoneyBillWave className="text-green-500" />
                                {job.salary ||
                                  "Salary not specified"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              status.toLowerCase() ===
                              "active"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {status.toLowerCase() ===
                            "active" ? (
                              <FaCheckCircle />
                            ) : (
                              <FaClock />
                            )}

                            {status}
                          </span>

                          <button
                            onClick={() =>
                              handleDeleteJob(
                                job._id
                              )
                            }
                            disabled={
                              deleteLoading ===
                              `job-${job._id}`
                            }
                            className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition disabled:opacity-50"
                          >
                            {deleteLoading ===
                            `job-${job._id}` ? (
                              <FaSyncAlt className="animate-spin" />
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="text-lg font-bold text-gray-900">
                Recent Users
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Newly registered users
              </p>
            </div>

            <div className="p-5 space-y-5">
              {usersLoading ? (
                <div className="text-center text-gray-500 py-5">
                  Loading users...
                </div>
              ) : recentUsers.length === 0 ? (
                <div className="text-center text-gray-500 py-5">
                  No users found.
                </div>
              ) : (
                recentUsers
                  .slice(0, 5)
                  .map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3"
                    >
                      <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold shrink-0">
                        {getInitials(
                          user.name
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">
                          {user.name}
                        </h3>

                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>

                        <span className="text-xs text-purple-600 capitalize">
                          {user.role}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          handleDeleteUser(
                            user._id
                          )
                        }
                        disabled={
                          deleteLoading ===
                          `user-${user._id}`
                        }
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition disabled:opacity-50 shrink-0"
                      >
                        {deleteLoading ===
                        `user-${user._id}` ? (
                          <FaSyncAlt className="animate-spin text-xs" />
                        ) : (
                          <FaTrash className="text-xs" />
                        )}
                      </button>
                    </div>
                  ))
              )}

              <button
                onClick={() =>
                  handleNavigation("users")
                }
                className="w-full border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white py-2.5 rounded-lg text-sm transition"
              >
                View All Users
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Platform Overview
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Current platform statistics
                </p>
              </div>

              <FaChartLine className="text-purple-600 text-xl" />
            </div>

            <div className="space-y-5 mt-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Candidates
                  </span>

                  <span className="text-sm font-semibold">
                    {dashboardStats.totalUsers
                      ? Math.round(
                          (dashboardStats.candidates /
                            dashboardStats.totalUsers) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{
                      width: `${
                        dashboardStats.totalUsers
                          ? Math.round(
                              (dashboardStats.candidates /
                                dashboardStats.totalUsers) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Recruiters
                  </span>

                  <span className="text-sm font-semibold">
                    {dashboardStats.totalUsers
                      ? Math.round(
                          (dashboardStats.recruiters /
                            dashboardStats.totalUsers) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${
                        dashboardStats.totalUsers
                          ? Math.round(
                              (dashboardStats.recruiters /
                                dashboardStats.totalUsers) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Active Jobs
                  </span>

                  <span className="text-sm font-semibold">
                    {dashboardStats.totalJobs
                      ? Math.round(
                          (dashboardStats.activeJobs /
                            dashboardStats.totalJobs) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${
                        dashboardStats.totalJobs
                          ? Math.round(
                              (dashboardStats.activeJobs /
                                dashboardStats.totalJobs) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-7">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <h3 className="text-lg font-bold">
                  {dashboardStats.candidates}
                </h3>

                <p className="text-xs text-gray-500">
                  Candidates
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <h3 className="text-lg font-bold">
                  {dashboardStats.recruiters}
                </h3>

                <p className="text-xs text-gray-500">
                  Recruiters
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <h3 className="text-lg font-bold">
                  {dashboardStats.totalJobs}
                </h3>

                <p className="text-xs text-gray-500">
                  Jobs
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-gray-900">
                Recent Activity
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Live platform information
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <FaUsers />
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    Total registered users
                  </p>

                  <h3 className="font-semibold text-sm mt-1">
                    {dashboardStats.totalUsers} users
                  </h3>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <FaBriefcase />
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    Jobs currently available
                  </p>

                  <h3 className="font-semibold text-sm mt-1">
                    {dashboardStats.activeJobs} active jobs
                  </h3>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <FaBuilding />
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    Registered companies
                  </p>

                  <h3 className="font-semibold text-sm mt-1">
                    {dashboardStats.totalCompanies} companies
                  </h3>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <FaFileAlt />
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    Applications submitted
                  </p>

                  <h3 className="font-semibold text-sm mt-1">
                    {dashboardStats.totalApplications} applications
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-lg font-bold">
            Quick Actions
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage your platform quickly
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            <button
              onClick={() =>
                handleNavigation("jobs")
              }
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <FaPlus />
              </div>

              <div>
                <h3 className="font-semibold text-sm">
                  Add Job
                </h3>

                <p className="text-xs text-gray-500">
                  Manage jobs
                </p>
              </div>
            </button>

            <button
              onClick={() =>
                handleNavigation("users")
              }
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <FaUsers />
              </div>

              <div>
                <h3 className="font-semibold text-sm">
                  Manage Users
                </h3>

                <p className="text-xs text-gray-500">
                  View all users
                </p>
              </div>
            </button>

            <button
              onClick={() =>
                handleNavigation("companies")
              }
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <FaBuilding />
              </div>

              <div>
                <h3 className="font-semibold text-sm">
                  Companies
                </h3>

                <p className="text-xs text-gray-500">
                  Manage companies
                </p>
              </div>
            </button>

            <button
              onClick={() =>
                handleNavigation("applications")
              }
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <FaFileAlt />
              </div>

              <div>
                <h3 className="font-semibold text-sm">
                  Applications
                </h3>

                <p className="text-xs text-gray-500">
                  Review applications
                </p>
              </div>
            </button>
          </div>
        </div>
      </>
    );
  };

  // =====================================================
  // USERS
  // =====================================================

  const renderUsers = () => {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Users
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all registered users.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg transition"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {usersLoading ? (
            <div className="p-10 text-center text-gray-500">
              Loading users...
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      User
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Email
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Role
                    </th>

                    <th className="text-right px-5 py-4 text-sm font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {recentUsers.map(
                    (user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                              {getInitials(
                                user.name
                              )}
                            </div>

                            <span className="font-medium text-gray-900">
                              {user.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>

                        <td className="px-5 py-4">
                          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-medium capitalize">
                            {user.role}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            <button
                              onClick={() =>
                                handleDeleteUser(
                                  user._id
                                )
                              }
                              disabled={
                                deleteLoading ===
                                `user-${user._id}`
                              }
                              className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition disabled:opacity-50"
                            >
                              {deleteLoading ===
                              `user-${user._id}` ? (
                                <FaSyncAlt className="animate-spin" />
                              ) : (
                                <FaTrash />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // =====================================================
  // JOBS
  // =====================================================

  const renderJobs = () => {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Jobs
            </h1>

            <p className="text-gray-500 mt-1">
              Manage jobs posted on CareerConnect.
            </p>
          </div>

          <button
            onClick={fetchJobs}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg transition"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {jobsLoading ? (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-10 text-center text-gray-500">
              Loading jobs...
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-10 text-center text-gray-500">
              No jobs found.
            </div>
          ) : (
            recentJobs.map((job) => {
              const companyName =
                getCompanyName(job);

              return (
                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow-lg p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 min-w-0">
                      <CompanyLogo
                        src={getCompanyLogo(job)}
                        name={companyName}
                        className="w-12 h-12"
                      />

                      <div className="min-w-0">
                        <h2 className="font-bold text-gray-900 truncate">
                          {job.title ||
                            "Untitled Job"}
                        </h2>

                        <p className="text-sm text-gray-600 mt-1">
                          {companyName}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleDeleteJob(
                          job._id
                        )
                      }
                      disabled={
                        deleteLoading ===
                        `job-${job._id}`
                      }
                      className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition disabled:opacity-50 shrink-0"
                    >
                      {deleteLoading ===
                      `job-${job._id}` ? (
                        <FaSyncAlt className="animate-spin" />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-5">
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                      {job.location ||
                        "Location not specified"}
                    </span>

                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                      {job.jobType ||
                        job.type ||
                        "Job Type"}
                    </span>

                    <span className="text-xs bg-green-100 text-green-600 px-3 py-1.5 rounded-full">
                      {job.status ||
                        "Active"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                    <FaMoneyBillWave className="text-green-500" />

                    {job.salary ||
                      "Salary not specified"}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // =====================================================
  // COMPANIES
  // =====================================================

  const renderCompanies = () => {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Companies
            </h1>

            <p className="text-gray-500 mt-1">
              Manage registered companies.
            </p>
          </div>

          <button
            onClick={fetchCompanies}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg transition"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {companiesLoading ? (
            <div className="col-span-full bg-white rounded-xl shadow-lg p-10 text-center text-gray-500">
              Loading companies...
            </div>
          ) : companies.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-lg p-10 text-center text-gray-500">
              No companies found.
            </div>
          ) : (
            companies.map(
              (company) => (
                <div
                  key={company._id}
                  onClick={() =>
                    handleCompanyClick(
                      company._id
                    )
                  }
                  className="bg-white rounded-xl shadow-lg p-5 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <CompanyLogo
                        src={getCompanyLogo(company)}
                        name={
                          company.name ||
                          company.companyName ||
                          "Company"
                        }
                        className="w-12 h-12"
                      />

                      <div className="min-w-0">
                        <h2 className="font-bold text-gray-900 truncate">
                          {company.name ||
                            company.companyName ||
                            "Unnamed Company"}
                        </h2>

                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <FaMapMarkerAlt className="text-purple-500" />

                          {company.location ||
                            company.city ||
                            "Location not specified"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        handleDeleteCompany(
                          company._id
                        );
                      }}
                      disabled={
                        deleteLoading ===
                        `company-${company._id}`
                      }
                      className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition disabled:opacity-50 shrink-0"
                    >
                      {deleteLoading ===
                      `company-${company._id}` ? (
                        <FaSyncAlt className="animate-spin" />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>

                  {company.industry && (
                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                      <FaIndustry className="text-purple-500" />

                      {company.industry}
                    </div>
                  )}

                  {company.description && (
                    <p className="text-sm text-gray-500 mt-4 line-clamp-3">
                      {company.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-5 pt-4 border-t">
                    <span className="text-xs text-gray-400">
                      View company details
                    </span>

                    <FaEye className="text-purple-600" />
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    );
  };

  // =====================================================
  // APPLICATION HELPERS
  // =====================================================

  const getApplicationCandidate = (
    application
  ) => {
    return (
      application?.candidate ||
      application?.user ||
      application?.applicant ||
      application?.candidateId ||
      {}
    );
  };

  const getApplicationJob = (
    application
  ) => {
    return (
      application?.job ||
      application?.jobId ||
      {}
    );
  };

  const getApplicationCompany = (
    application
  ) => {
    const job =
      getApplicationJob(application);

    return (
      application?.company ||
      application?.companyId ||
      job?.company ||
      job?.companyId ||
      {}
    );
  };

  const getApplicationRecruiter = (
    application
  ) => {
    const job =
      getApplicationJob(application);

    return (
      application?.recruiter ||
      application?.recruiterId ||
      job?.recruiter ||
      job?.recruiterId ||
      {}
    );
  };

  const getCandidateName = (
    application
  ) => {
    const candidate =
      getApplicationCandidate(
        application
      );

    if (typeof candidate === "string") {
      return (
        application?.candidateName ||
        "Unknown Candidate"
      );
    }

    return (
      candidate?.name ||
      application?.candidateName ||
      application?.userName ||
      "Unknown Candidate"
    );
  };

  const getCandidateEmail = (
    application
  ) => {
    const candidate =
      getApplicationCandidate(
        application
      );

    if (typeof candidate === "string") {
      return (
        application?.candidateEmail ||
        application?.userEmail ||
        "No email"
      );
    }

    return (
      candidate?.email ||
      application?.candidateEmail ||
      application?.userEmail ||
      "No email"
    );
  };

  const getApplicationJobTitle = (
    application
  ) => {
    const job =
      getApplicationJob(application);

    if (typeof job === "string") {
      return (
        application?.jobTitle ||
        "Unknown Job"
      );
    }

    return (
      job?.title ||
      application?.jobTitle ||
      "Unknown Job"
    );
  };

  const getApplicationCompanyName = (
    application
  ) => {
    const company =
      getApplicationCompany(
        application
      );

    if (typeof company === "string") {
      return company;
    }

    return (
      company?.name ||
      company?.companyName ||
      application?.companyName ||
      "Unknown Company"
    );
  };

  const getApplicationRecruiterName = (
    application
  ) => {
    const recruiter =
      getApplicationRecruiter(
        application
      );

    if (typeof recruiter === "string") {
      return recruiter;
    }

    return (
      recruiter?.name ||
      recruiter?.email ||
      application?.recruiterName ||
      "Not specified"
    );
  };

  const getApplicationDate = (
    application
  ) => {
    const date =
      application?.createdAt ||
      application?.appliedAt ||
      application?.applicationDate;

    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const getApplicationStatusClasses = (
    status
  ) => {
    const normalizedStatus = String(
      status || "pending"
    )
      .toLowerCase()
      .trim();

    switch (normalizedStatus) {
      case "shortlisted":
        return "bg-blue-100 text-blue-600";

      case "accepted":
        return "bg-green-100 text-green-600";

      case "rejected":
        return "bg-red-100 text-red-600";

      case "interview":
      case "interviewed":
        return "bg-purple-100 text-purple-600";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  const getApplicationResume = (
    application
  ) => {
    return (
      application?.resume ||
      application?.resumeUrl ||
      application?.cv ||
      application?.resumeURL ||
      ""
    );
  };

  // =====================================================
  // APPLICATIONS
  // =====================================================

  const renderApplications = () => {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Applications
            </h1>

            <p className="text-gray-500 mt-1">
              Review real applications submitted
              by candidates.
            </p>
          </div>

          <button
            onClick={fetchApplications}
            disabled={applicationsLoading}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg transition disabled:opacity-50"
          >
            <FaSyncAlt
              className={
                applicationsLoading
                  ? "animate-spin"
                  : ""
              }
            />

            {applicationsLoading
              ? "Loading..."
              : "Refresh"}
          </button>
        </div>

        {applicationsError && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
            <FaExclamationTriangle />

            <span>
              {applicationsError}
            </span>

            <button
              onClick={() =>
                setApplicationsError("")
              }
              className="ml-auto font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* DESKTOP TABLE */}

        <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden">
          {applicationsLoading ? (
            <div className="p-12 text-center text-gray-500">
              <FaSyncAlt className="animate-spin mx-auto text-2xl mb-3 text-purple-600" />

              <p>
                Loading real applications...
              </p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mb-4">
                <FaFileAlt />
              </div>

              <h2 className="text-lg font-semibold text-gray-900">
                No applications found
              </h2>

              <p className="text-gray-500 mt-1">
                There are currently no job
                applications in the database.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Candidate
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Job
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Company
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Recruiter
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Applied
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Resume
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Cover Letter
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {applications.map(
                    (application) => {
                      const candidateName =
                        getCandidateName(
                          application
                        );

                      const candidateEmail =
                        getCandidateEmail(
                          application
                        );

                      const jobTitle =
                        getApplicationJobTitle(
                          application
                        );

                      const companyName =
                        getApplicationCompanyName(
                          application
                        );

                      const recruiterName =
                        getApplicationRecruiterName(
                          application
                        );

                      const status =
                        application?.status ||
                        "Pending";

                      const resume =
                        getApplicationResume(
                          application
                        );

                      const coverLetter =
                        application?.coverLetter ||
                        application?.coverletter ||
                        "";

                      return (
                        <tr
                          key={
                            application._id
                          }
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">
                                {getInitials(
                                  candidateName
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900">
                                  {candidateName}
                                </p>

                                <p className="text-xs text-gray-500 max-w-[190px] truncate">
                                  {candidateEmail}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <FaBriefcase />
                              </div>

                              <span className="font-medium text-gray-900">
                                {jobTitle}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <CompanyLogo
                                src={getCompanyLogo(
                                  getApplicationCompany(
                                    application
                                  )
                                )}
                                name={companyName}
                                className="w-9 h-9"
                              />

                              <span className="text-sm text-gray-700">
                                {companyName}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                <FaUsers />
                              </div>

                              <span className="text-sm text-gray-700">
                                {recruiterName}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {getApplicationDate(
                              application
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getApplicationStatusClasses(
                                status
                              )}`}
                            >
                              {String(
                                status
                              ).toLowerCase() ===
                              "accepted" ? (
                                <FaCheckCircle />
                              ) : (
                                <FaClock />
                              )}

                              {status}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {resume ? (
                              <a
                                href={resume}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-medium"
                              >
                                <FaEye />
                                View
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400">
                                No resume
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {coverLetter ? (
                              <button
                                type="button"
                                onClick={() =>
                                  window.alert(
                                    coverLetter
                                  )
                                }
                                className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-medium"
                              >
                                <FaEye />
                                View
                              </button>
                            ) : (
                              <span className="text-sm text-gray-400">
                                No cover letter
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MOBILE CARDS */}

        <div className="lg:hidden">
          {applicationsLoading ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
              <FaSyncAlt className="animate-spin mx-auto text-2xl mb-3 text-purple-600" />

              Loading applications...
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-10 text-center text-gray-500">
              <FaFileAlt className="mx-auto text-3xl text-orange-500 mb-3" />

              <p className="font-semibold text-gray-900">
                No applications found
              </p>

              <p className="text-sm mt-1">
                No applications are currently
                available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {applications.map(
                (application) => {
                  const candidateName =
                    getCandidateName(
                      application
                    );

                  const candidateEmail =
                    getCandidateEmail(
                      application
                    );

                  const jobTitle =
                    getApplicationJobTitle(
                      application
                    );

                  const companyName =
                    getApplicationCompanyName(
                      application
                    );

                  const recruiterName =
                    getApplicationRecruiterName(
                      application
                    );

                  const status =
                    application?.status ||
                    "Pending";

                  const resume =
                    getApplicationResume(
                      application
                    );

                  const coverLetter =
                    application?.coverLetter ||
                    application?.coverletter ||
                    "";

                  return (
                    <div
                      key={`mobile-${application._id}`}
                      className="bg-white rounded-xl shadow-lg p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">
                            {getInitials(
                              candidateName
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {candidateName}
                            </h3>

                            <p className="text-xs text-gray-500 truncate">
                              {candidateEmail}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize shrink-0 ${getApplicationStatusClasses(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="mt-5 space-y-4">
                        <div className="flex items-start gap-3">
                          <FaBriefcase className="text-purple-600 mt-1 shrink-0" />

                          <div>
                            <p className="text-xs text-gray-400">
                              Job
                            </p>

                            <p className="text-sm font-medium text-gray-900">
                              {jobTitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <CompanyLogo
                            src={getCompanyLogo(
                              getApplicationCompany(
                                application
                              )
                            )}
                            name={companyName}
                            className="w-9 h-9"
                          />

                          <div>
                            <p className="text-xs text-gray-400">
                              Company
                            </p>

                            <p className="text-sm font-medium text-gray-900">
                              {companyName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <FaUsers className="text-blue-600 mt-1 shrink-0" />

                          <div>
                            <p className="text-xs text-gray-400">
                              Recruiter
                            </p>

                            <p className="text-sm font-medium text-gray-900">
                              {recruiterName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <FaClock className="text-orange-500 mt-1 shrink-0" />

                          <div>
                            <p className="text-xs text-gray-400">
                              Applied
                            </p>

                            <p className="text-sm font-medium text-gray-900">
                              {getApplicationDate(
                                application
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 pt-4 border-t">
                        {resume ? (
                          <a
                            href={resume}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-lg transition"
                          >
                            <FaEye />
                            Resume
                          </a>
                        ) : (
                          <div className="flex items-center justify-center text-sm text-gray-400 border border-gray-200 rounded-lg px-4 py-2.5">
                            No Resume
                          </div>
                        )}

                        {coverLetter ? (
                          <button
                            type="button"
                            onClick={() =>
                              window.alert(
                                coverLetter
                              )
                            }
                            className="flex items-center justify-center gap-2 border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-4 py-2.5 rounded-lg transition"
                          >
                            <FaFileAlt />
                            Cover Letter
                          </button>
                        ) : (
                          <div className="flex items-center justify-center text-sm text-gray-400 border border-gray-200 rounded-lg px-4 py-2.5">
                            No Cover Letter
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // =====================================================
  // REPORTS
  // =====================================================

  const renderReports = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <FaFlag />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Reports
            </h1>

            <p className="text-gray-500 mt-1">
              Platform reports and moderation
              tools.
            </p>
          </div>
        </div>

        <div className="mt-6 p-5 bg-gray-50 rounded-xl text-gray-500 text-sm">
          Report management API is not
          currently connected.
        </div>
      </div>
    );
  };

  // =====================================================
  // ADMIN PROFILE
  // =====================================================

  const renderProfile = () => {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Profile
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your CareerConnect
            administrator profile.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-purple-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg overflow-hidden">
                  {profileImage ? (
                    <img
                      src={getImageUrl(profileImage)}
                      alt={currentUser?.name || "Admin"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(currentUser?.name)
                  )}
                </div>

                <label
                  htmlFor="admin-profile-image"
                  className="absolute bottom-0 right-0 w-9 h-9 bg-purple-600 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md border-2 border-white transition"
                  title="Change profile picture"
                >
                  {uploadingProfile ? (
                    <FaSyncAlt className="animate-spin text-sm" />
                  ) : (
                    <FaCamera className="text-sm" />
                  )}
                </label>

                <input
                  id="admin-profile-image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                  disabled={uploadingProfile}
                />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-4">
                {currentUser?.name ||
                  "Admin"}
              </h2>

              <p className="text-gray-500 text-sm mt-1 break-all">
                {currentUser?.email ||
                  "No email"}
              </p>

              <span className="mt-3 px-4 py-1.5 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold capitalize">
                {currentUser?.role ||
                  "admin"}
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Profile Information
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your administrator account
              information.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Full Name
                </label>

                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {currentUser?.name ||
                    "Admin"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email Address
                </label>

                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 break-all">
                  {currentUser?.email ||
                    "No email"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Account Role
                </label>

                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 capitalize">
                  {currentUser?.role ||
                    "admin"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Account Status
                </label>

                <div className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-600 font-medium">
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-lg font-bold text-gray-900">
            Administrator Account
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            This account has full access to
            CareerConnect administration.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
            <div className="bg-purple-50 rounded-xl p-5">
              <p className="text-sm text-gray-500">
                Access Level
              </p>

              <h3 className="text-lg font-bold text-purple-600 mt-1">
                Full Access
              </h3>
            </div>

            <div className="bg-blue-50 rounded-xl p-5">
              <p className="text-sm text-gray-500">
                Account Type
              </p>

              <h3 className="text-lg font-bold text-blue-600 mt-1">
                Administrator
              </h3>
            </div>

            <div className="bg-green-50 rounded-xl p-5">
              <p className="text-sm text-gray-500">
                Status
              </p>

              <h3 className="text-lg font-bold text-green-600 mt-1">
                Active
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =====================================================
  // SETTINGS
  // =====================================================

  const renderSettings = () => {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Settings
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your CareerConnect account
            preferences and security.
          </p>
        </div>

        {settingsLoading ? (
          <div className="bg-white rounded-xl shadow-lg p-10 text-center text-gray-500">
            <FaSyncAlt className="animate-spin mx-auto text-xl mb-3" />

            Loading settings...
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <FaCog />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      General Settings
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Manage your account preferences.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <FaBell />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Job Alerts
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Receive notifications about
                        new job opportunities.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        jobAlerts:
                          !prev.jobAlerts,
                      }))
                    }
                    className={`relative w-14 h-7 rounded-full transition ${
                      settings.jobAlerts
                        ? "bg-purple-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${
                        settings.jobAlerts
                          ? "left-8"
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      {settings.profileVisibility ===
                      "public" ? (
                        <FaEye />
                      ) : (
                        <FaEyeSlash />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        Profile Visibility
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Choose who can see your
                        profile.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        <button
                          type="button"
                          onClick={() =>
                            setSettings(
                              (prev) => ({
                                ...prev,
                                profileVisibility:
                                  "public",
                              })
                            )
                          }
                          className={`p-4 rounded-xl border text-left transition ${
                            settings.profileVisibility ===
                            "public"
                              ? "border-purple-600 bg-purple-50"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                        >
                          <FaEye
                            className={`mb-2 ${
                              settings.profileVisibility ===
                              "public"
                                ? "text-purple-600"
                                : "text-gray-400"
                            }`}
                          />

                          <h4 className="font-semibold text-gray-900">
                            Public
                          </h4>

                          <p className="text-xs text-gray-500 mt-1">
                            Everyone can see
                            your profile.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setSettings(
                              (prev) => ({
                                ...prev,
                                profileVisibility:
                                  "private",
                              })
                            )
                          }
                          className={`p-4 rounded-xl border text-left transition ${
                            settings.profileVisibility ===
                            "private"
                              ? "border-purple-600 bg-purple-50"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                        >
                          <FaLock
                            className={`mb-2 ${
                              settings.profileVisibility ===
                              "private"
                                ? "text-purple-600"
                                : "text-gray-400"
                            }`}
                          />

                          <h4 className="font-semibold text-gray-900">
                            Private
                          </h4>

                          <p className="text-xs text-gray-500 mt-1">
                            Only you can see
                            your profile.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setSettings(
                              (prev) => ({
                                ...prev,
                                profileVisibility:
                                  "recruiters",
                              })
                            )
                          }
                          className={`p-4 rounded-xl border text-left transition ${
                            settings.profileVisibility ===
                            "recruiters"
                              ? "border-purple-600 bg-purple-50"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                        >
                          <FaUsers
                            className={`mb-2 ${
                              settings.profileVisibility ===
                              "recruiters"
                                ? "text-purple-600"
                                : "text-gray-400"
                            }`}
                          />

                          <h4 className="font-semibold text-gray-900">
                            Recruiters
                          </h4>

                          <p className="text-xs text-gray-500 mt-1">
                            Recruiters can see
                            your profile.
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 flex justify-end">
                  <button
                    onClick={
                      handleSaveSettings
                    }
                    disabled={
                      settingsSaving
                    }
                    className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition disabled:opacity-50"
                  >
                    {settingsSaving ? (
                      <>
                        <FaSyncAlt className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        Save Settings
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <FaLock />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Change Password
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Update your account password.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={
                  handleChangePassword
                }
                className="p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>

                    <input
                      type="password"
                      value={
                        passwordData.currentPassword
                      }
                      onChange={(e) =>
                        setPasswordData(
                          (prev) => ({
                            ...prev,
                            currentPassword:
                              e.target.value,
                          })
                        )
                      }
                      placeholder="Current password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>

                    <input
                      type="password"
                      value={
                        passwordData.newPassword
                      }
                      onChange={(e) =>
                        setPasswordData(
                          (prev) => ({
                            ...prev,
                            newPassword:
                              e.target.value,
                          })
                        )
                      }
                      placeholder="New password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      value={
                        passwordData.confirmPassword
                      }
                      onChange={(e) =>
                        setPasswordData(
                          (prev) => ({
                            ...prev,
                            confirmPassword:
                              e.target.value,
                          })
                        )
                      }
                      placeholder="Confirm password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-5">
                  <button
                    type="submit"
                    disabled={
                      passwordLoading
                    }
                    className="flex items-center gap-2 bg-gray-900 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition disabled:opacity-50"
                  >
                    {passwordLoading ? (
                      <>
                        <FaSyncAlt className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaLock />
                        Change Password
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

  // =====================================================
  // CONTENT SWITCHER
  // =====================================================

  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return renderUsers();

      case "jobs":
        return renderJobs();

      case "companies":
        return renderCompanies();

      case "applications":
        return renderApplications();

     case "reports":
  return (
    <Reports
      dashboardStats={dashboardStats}
      applications={applications}
      recentUsers={recentUsers}
      recentJobs={recentJobs}
      companies={companies}
    />
  );

      case "profile":
        return renderProfile();

      case "settings":
        return renderSettings();

      default:
        return renderDashboard();
    }
  };

  // =====================================================
  // SIDEBAR CLASS
  // =====================================================

  const sidebarItemClass = (
    section
  ) => {
    return `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      activeSection === section
        ? "bg-purple-600 text-white"
        : "text-gray-300 hover:bg-white/10 hover:text-purple-400"
    }`;
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* MOBILE HEADER */}

      <div className="lg:hidden bg-[#070B2B] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold">
          Career
          <span className="text-purple-500">
            Connect
          </span>
        </h1>

        <button
          onClick={() =>
            setSidebarOpen(
              !sidebarOpen
            )
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

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* SIDEBAR */}

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
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <h1 className="text-2xl font-bold">
            Career
            <span className="text-purple-500">
              Connect
            </span>
          </h1>
        </div>

        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-lg font-bold overflow-hidden shrink-0">
              {profileImage ? (
                <img
                  src={getImageUrl(profileImage)}
                  alt={currentUser?.name || "Admin"}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(currentUser?.name)
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold truncate">
                {currentUser?.name ||
                  "Admin"}
              </h3>

              <p className="text-xs text-gray-400">
                Administrator
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-3">
            Main Menu
          </p>

          <div className="space-y-2">
            <button
              onClick={() =>
                handleNavigation(
                  "dashboard"
                )
              }
              className={sidebarItemClass(
                "dashboard"
              )}
            >
              <FaChartLine />
              Dashboard
            </button>

            <button
              onClick={() =>
                handleNavigation("users")
              }
              className={sidebarItemClass(
                "users"
              )}
            >
              <FaUsers />
              Users
            </button>

            <button
              onClick={() =>
                handleNavigation("jobs")
              }
              className={sidebarItemClass(
                "jobs"
              )}
            >
              <FaBriefcase />
              Jobs
            </button>

            <button
              onClick={() =>
                handleNavigation(
                  "companies"
                )
              }
              className={sidebarItemClass(
                "companies"
              )}
            >
              <FaBuilding />
              Companies
            </button>

            <button
              onClick={() =>
                handleNavigation(
                  "applications"
                )
              }
              className={sidebarItemClass(
                "applications"
              )}
            >
              <FaFileAlt />
              Applications
            </button>

            <button
              onClick={() =>
                handleNavigation(
                  "reports"
                )
              }
              className={sidebarItemClass(
                "reports"
              )}
            >
              <FaFlag />
              Reports
            </button>
          </div>

          <p className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-3 mt-8">
            Account
          </p>

          <div className="space-y-2">
            <button
              onClick={() =>
                handleNavigation("profile")
              }
              className={sidebarItemClass(
                "profile"
              )}
            >
              <FaUserShield />
              Admin Profile
            </button>

            <button
              onClick={() =>
                handleNavigation("settings")
              }
              className={sidebarItemClass(
                "settings"
              )}
            >
              <FaCog />
              Settings
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

          {/* SUCCESS */}

          {success && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <FaCheckCircle />

              <span>{success}</span>

              <button
                onClick={() =>
                  setSuccess("")
                }
                className="ml-auto font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
              <FaExclamationTriangle />

              <span>{error}</span>

              <button
                onClick={() =>
                  setError("")
                }
                className="ml-auto font-bold"
              >
                ×
              </button>
            </div>
          )}

          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;