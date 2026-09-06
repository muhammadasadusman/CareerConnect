import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../../api/api";

import {
  FaArrowLeft,
  FaCog,
  FaUser,
  FaLock,
  FaBell,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaBuilding,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

const Settings = () => {
  // ==========================================
  // Profile Settings
  // ==========================================

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // ==========================================
  // Password Settings
  // ==========================================

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // ==========================================
  // Notification Settings
  // ==========================================

  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    newApplications: true,
    interviewNotifications: true,
  });

  // ==========================================
  // Privacy Settings
  // ==========================================

  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
  });

  // ==========================================
  // Loading / Messages
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  // ==========================================
  // Show Success Message
  // ==========================================

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setErrorMessage("");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // ==========================================
  // Fetch Settings
  // ==========================================

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await API.get("/settings");

        const user = response.data.user;

        // Profile
        setProfile({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });

        // Notifications
        setNotifications({
          jobAlerts:
            user.notifications?.jobAlerts ?? true,

          newApplications:
            user.notifications?.newApplications ?? true,

          interviewNotifications:
            user.notifications
              ?.interviewNotifications ?? true,
        });

        // Privacy
        setPrivacy({
          profileVisibility:
            user.privacy?.profileVisibility ?? true,
        });
      } catch (error) {
        console.error(
          "Fetch Settings Error:",
          error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");

          window.location.href = "/login";

          return;
        }

        setErrorMessage(
          error.response?.data?.message ||
            "Failed to load settings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // ==========================================
  // Handle Profile Change
  // ==========================================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Handle Password Change
  // ==========================================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Save Profile
  // ==========================================

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!profile.name.trim()) {
      setErrorMessage("Name is required.");
      return;
    }

    if (!profile.email.trim()) {
      setErrorMessage("Email is required.");
      return;
    }

    try {
      setSavingProfile(true);
      setErrorMessage("");

      const response = await API.put(
        "/settings/profile",
        {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
        }
      );

      const user = response.data.user;

      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });

      // Update localStorage user if available
      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        try {
          const parsedUser =
            JSON.parse(storedUser);

          const updatedUser = {
            ...parsedUser,
            name: user.name,
            email: user.email,
          };

          localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
          );
        } catch (error) {
          console.error(
            "Local User Update Error:",
            error
          );
        }
      }

      showSuccess(
        "Profile settings saved successfully."
      );
    } catch (error) {
      console.error(
        "Save Profile Error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        window.location.href = "/login";

        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to save profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // ==========================================
  // Change Password
  // ==========================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (
      !password.currentPassword ||
      !password.newPassword ||
      !password.confirmPassword
    ) {
      setErrorMessage(
        "Please fill all password fields."
      );
      return;
    }

    if (password.newPassword.length < 6) {
      setErrorMessage(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      password.newPassword !==
      password.confirmPassword
    ) {
      setErrorMessage(
        "New passwords do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);
      setErrorMessage("");

      const response = await API.put(
        "/settings/password",
        {
          currentPassword:
            password.currentPassword,

          newPassword:
            password.newPassword,

          confirmPassword:
            password.confirmPassword,
        }
      );

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      showSuccess(
        response.data.message ||
          "Password changed successfully."
      );
    } catch (error) {
      console.error(
        "Change Password Error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        window.location.href = "/login";

        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // ==========================================
  // Toggle Notification
  // ==========================================

  const toggleNotification = async (key) => {
    const previousNotifications = {
      ...notifications,
    };

    const updatedNotifications = {
      ...notifications,
      [key]: !notifications[key],
    };

    setNotifications(updatedNotifications);
    setErrorMessage("");

    try {
      await API.put("/settings/preferences", {
        notifications: updatedNotifications,
        privacy,
      });

      showSuccess(
        "Notification settings updated."
      );
    } catch (error) {
      console.error(
        "Notification Update Error:",
        error
      );

      // Revert UI if API fails
      setNotifications(
        previousNotifications
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        window.location.href = "/login";

        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update notification settings."
      );
    }
  };

  // ==========================================
  // Toggle Privacy
  // ==========================================

  const togglePrivacy = async () => {
    const previousPrivacy = {
      ...privacy,
    };

    const updatedPrivacy = {
      ...privacy,
      profileVisibility:
        !privacy.profileVisibility,
    };

    setPrivacy(updatedPrivacy);
    setErrorMessage("");

    try {
      await API.put("/settings/preferences", {
        notifications,
        privacy: updatedPrivacy,
      });

      showSuccess(
        "Privacy settings updated."
      );
    } catch (error) {
      console.error(
        "Privacy Update Error:",
        error
      );

      // Revert UI if API fails
      setPrivacy(previousPrivacy);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        window.location.href = "/login";

        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update privacy settings."
      );
    }
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ==========================================
          Header
      ========================================== */}

      <header className="bg-[#070B2B] text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="min-h-20 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            {/* Logo */}

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold">

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

      {/* ==========================================
          Main
      ========================================== */}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ==========================================
            Page Heading
        ========================================== */}

        <div className="mb-6">

          <p className="text-sm text-purple-600 font-medium">
            EMPLOYER PANEL
          </p>

          <div className="flex items-center gap-3 mt-1">

            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <FaCog />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Settings
            </h1>

          </div>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Manage your account, security,
            notifications and privacy preferences.
          </p>

        </div>

        {/* ==========================================
            Loading
        ========================================== */}

        {loading && (
          <div className="mb-6 flex items-center gap-3 bg-purple-50 border border-purple-200 text-purple-700 rounded-xl px-4 py-3">

            <div className="w-5 h-5 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>

            <p className="text-sm font-medium">
              Loading your settings...
            </p>

          </div>
        )}

        {/* ==========================================
            Error Message
        ========================================== */}

        {errorMessage && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">

            <p className="text-sm font-medium">
              {errorMessage}
            </p>

          </div>
        )}

        {/* ==========================================
            Success Message
        ========================================== */}

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3">

            <FaCheckCircle />

            <p className="text-sm font-medium">
              {successMessage}
            </p>

          </div>
        )}

        {/* ==========================================
            Settings
        ========================================== */}

        <div className="space-y-6">

          {/* ==========================================
              Profile Settings
          ========================================== */}

          <section className="bg-white rounded-xl shadow-lg overflow-hidden">

            <div className="p-5 sm:p-6 border-b border-gray-200">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FaUser />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Account Information
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Update your basic account information.
                  </p>

                </div>

              </div>

            </div>

            <form
              onSubmit={handleSaveProfile}
              className="p-5 sm:p-6"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Name */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    disabled={loading || savingProfile}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your name"
                  />

                </div>

                {/* Email */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    disabled={loading || savingProfile}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your email"
                  />

                </div>

                {/* Phone */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    disabled={loading || savingProfile}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your phone number"
                  />

                </div>

              </div>

              <div className="flex justify-end mt-6">

                <button
                  type="submit"
                  disabled={savingProfile || loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 disabled:bg-purple-300 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg transition"
                >

                  {savingProfile ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}

                </button>

              </div>

            </form>

          </section>

          {/* ==========================================
              Password
          ========================================== */}

          <section className="bg-white rounded-xl shadow-lg overflow-hidden">

            <div className="p-5 sm:p-6 border-b border-gray-200">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <FaLock />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Password & Security
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Keep your account secure with a strong password.
                  </p>

                </div>

              </div>

            </div>

            <form
              onSubmit={handleChangePassword}
              className="p-5 sm:p-6"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Current Password */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showCurrentPassword
                          ? "text"
                          : "password"
                      }
                      name="currentPassword"
                      value={
                        password.currentPassword
                      }
                      onChange={
                        handlePasswordChange
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder="Enter current password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(
                          !showCurrentPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                    >

                      {showCurrentPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}

                    </button>

                  </div>

                </div>

                {/* New Password */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      name="newPassword"
                      value={
                        password.newPassword
                      }
                      onChange={
                        handlePasswordChange
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder="Enter new password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(
                          !showNewPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                    >

                      {showNewPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}

                    </button>

                  </div>

                </div>

                {/* Confirm Password */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={
                        password.confirmPassword
                      }
                      onChange={
                        handlePasswordChange
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder="Confirm new password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                    >

                      {showConfirmPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}

                    </button>

                  </div>

                </div>

              </div>

              <div className="flex justify-end mt-6">

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 disabled:bg-purple-300 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg transition"
                >

                  {changingPassword ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Changing...
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

          </section>

          {/* ==========================================
              Notifications
          ========================================== */}

          <section className="bg-white rounded-xl shadow-lg overflow-hidden">

            <div className="p-5 sm:p-6 border-b border-gray-200">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FaBell />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Notifications
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Choose which notifications you want to receive.
                  </p>

                </div>

              </div>

            </div>

            <div className="divide-y divide-gray-100">

              {/* Job Alerts */}

              <div className="p-5 sm:p-6 flex items-center justify-between gap-4">

                <div>

                  <h3 className="font-medium text-gray-900">
                    Job Alerts
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Receive notifications about job activity.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    toggleNotification(
                      "jobAlerts"
                    )
                  }
                  disabled={loading}
                  className={`relative w-12 h-6 rounded-full transition shrink-0 disabled:opacity-60 ${
                    notifications.jobAlerts
                      ? "bg-purple-600"
                      : "bg-gray-300"
                  }`}
                >

                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                      notifications.jobAlerts
                        ? "left-7"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

              {/* New Applications */}

              <div className="p-5 sm:p-6 flex items-center justify-between gap-4">

                <div>

                  <h3 className="font-medium text-gray-900">
                    New Applications
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Get notified when candidates apply.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    toggleNotification(
                      "newApplications"
                    )
                  }
                  disabled={loading}
                  className={`relative w-12 h-6 rounded-full transition shrink-0 disabled:opacity-60 ${
                    notifications.newApplications
                      ? "bg-purple-600"
                      : "bg-gray-300"
                  }`}
                >

                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                      notifications.newApplications
                        ? "left-7"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

              {/* Interview */}

              <div className="p-5 sm:p-6 flex items-center justify-between gap-4">

                <div>

                  <h3 className="font-medium text-gray-900">
                    Interview Notifications
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Receive updates about candidate interviews.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    toggleNotification(
                      "interviewNotifications"
                    )
                  }
                  disabled={loading}
                  className={`relative w-12 h-6 rounded-full transition shrink-0 disabled:opacity-60 ${
                    notifications.interviewNotifications
                      ? "bg-purple-600"
                      : "bg-gray-300"
                  }`}
                >

                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                      notifications.interviewNotifications
                        ? "left-7"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

            </div>

          </section>

          {/* ==========================================
              Privacy
          ========================================== */}

          <section className="bg-white rounded-xl shadow-lg overflow-hidden">

            <div className="p-5 sm:p-6 border-b border-gray-200">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                  <FaShieldAlt />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Privacy
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Control how your recruiter profile is visible.
                  </p>

                </div>

              </div>

            </div>

            <div className="p-5 sm:p-6">

              <div className="flex items-center justify-between gap-4">

                <div className="flex items-start gap-3">

                  <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                    <FaEye />
                  </div>

                  <div>

                    <h3 className="font-medium text-gray-900">
                      Profile Visibility
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Allow candidates to view your recruiter profile.
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={togglePrivacy}
                  disabled={loading}
                  className={`relative w-12 h-6 rounded-full transition shrink-0 disabled:opacity-60 ${
                    privacy.profileVisibility
                      ? "bg-purple-600"
                      : "bg-gray-300"
                  }`}
                >

                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                      privacy.profileVisibility
                        ? "left-7"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

            </div>

          </section>

          {/* ==========================================
              Company Settings
          ========================================== */}

          <section className="bg-white rounded-xl shadow-lg overflow-hidden">

            <div className="p-5 sm:p-6 border-b border-gray-200">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <FaBuilding />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Company Settings
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Manage your company information.
                  </p>

                </div>

              </div>

            </div>

            <div className="p-5 sm:p-6">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <h3 className="font-medium text-gray-900">
                    Company Profile
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Update your company name, logo and business details.
                  </p>

                </div>

                <Link
                  to="/employer/company-profile"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-5 py-3 rounded-lg transition"
                >
                  <FaBuilding />
                  Manage Company
                </Link>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
};

export default Settings;