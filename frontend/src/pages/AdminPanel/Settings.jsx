import { useEffect, useState } from "react";
import {
  FaBell,
  FaUserShield,
  FaLock,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSyncAlt,
} from "react-icons/fa";

import API from "../api/api";

const Setting = () => {
  // =====================================================
  // SETTINGS STATE
  // =====================================================

  const [jobAlerts, setJobAlerts] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);

  const [newApplications, setNewApplications] = useState(true);

  const [interviewNotifications, setInterviewNotifications] =
    useState(true);

  // =====================================================
  // PASSWORD STATE
  // =====================================================

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =====================================================
  // UI STATE
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // =====================================================
  // LOAD SETTINGS
  // =====================================================

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/users/profile");

      const user = response.data?.user;

      if (!user) {
        throw new Error("User data not found");
      }

      setJobAlerts(
        user.jobAlerts !== undefined ? Boolean(user.jobAlerts) : true
      );

      setProfileVisibility(
        user.profileVisibility !== undefined
          ? Boolean(user.profileVisibility)
          : true
      );

      setNewApplications(
        user.newApplications !== undefined
          ? Boolean(user.newApplications)
          : true
      );

      setInterviewNotifications(
        user.interviewNotifications !== undefined
          ? Boolean(user.interviewNotifications)
          : true
      );
    } catch (err) {
      console.error("Fetch Settings Error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return;
      }

      setError(
        err.response?.data?.message || "Failed to load settings."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD SETTINGS ON MOUNT
  // =====================================================

  useEffect(() => {
    fetchSettings();
  }, []);

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      const response = await API.put("/users/settings", {
        jobAlerts: Boolean(jobAlerts),
        profileVisibility: Boolean(profileVisibility),
        newApplications: Boolean(newApplications),
        interviewNotifications: Boolean(interviewNotifications),
      });

      setSuccess(
        response.data?.message || "Settings saved successfully."
      );
    } catch (err) {
      console.error("Save Settings Error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return;
      }

      setError(
        err.response?.data?.message || "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordSuccess("");
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setPasswordError("Please enter your new password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (!confirmPassword) {
      setPasswordError("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await API.put("/users/change-password", {
        currentPassword,
        newPassword,
      });

      setPasswordSuccess(
        response.data?.message ||
          "Password changed successfully."
      );

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Hide passwords after successful change
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      console.error("Change Password Error:", err);

      if (err.response?.status === 401) {
        setPasswordError(
          err.response?.data?.message ||
            "Current password is incorrect."
        );
      } else {
        setPasswordError(
          err.response?.data?.message ||
            "Failed to change password."
        );
      }
    } finally {
      setChangingPassword(false);
    }
  };

  // =====================================================
  // TOGGLE COMPONENT
  // =====================================================

  const Toggle = ({ enabled, onChange }) => {
    return (
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
          enabled ? "bg-purple-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    );
  };

  // =====================================================
  // PASSWORD INPUT COMPONENT
  // =====================================================

  const PasswordInput = ({
    value,
    onChange,
    placeholder,
    showPassword,
    setShowPassword,
  }) => {
    return (
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
          aria-label={
            showPassword ? "Hide password" : "Show password"
          }
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <FaSyncAlt className="text-2xl text-purple-600 animate-spin" />

          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="max-w-5xl mx-auto">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="mb-7">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="text-gray-500 mt-1">
          Manage your CareerConnect account settings and
          preferences.
        </p>
      </div>

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {success && (
        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <FaCheckCircle />

          <span className="text-sm">{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="ml-auto font-bold text-lg"
          >
            ×
          </button>
        </div>
      )}

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3">
          <FaExclamationTriangle />

          <span className="text-sm">{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-auto font-bold text-lg"
          >
            ×
          </button>
        </div>
      )}

      {/* =================================================
          NOTIFICATION SETTINGS
      ================================================= */}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <div className="p-6 border-b">
          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <FaBell />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Notification Settings
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Choose which notifications you want to receive.
              </p>
            </div>

          </div>
        </div>

        <div className="divide-y">

          {/* Job Alerts */}

          <div className="p-6 flex items-center justify-between gap-5">

            <div>
              <h3 className="font-semibold text-gray-900">
                Job Alerts
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Receive notifications about new job
                opportunities.
              </p>
            </div>

            <Toggle
              enabled={jobAlerts}
              onChange={setJobAlerts}
            />

          </div>

          {/* New Applications */}

          <div className="p-6 flex items-center justify-between gap-5">

            <div>
              <h3 className="font-semibold text-gray-900">
                New Applications
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Get notified when someone applies to your job.
              </p>
            </div>

            <Toggle
              enabled={newApplications}
              onChange={setNewApplications}
            />

          </div>

          {/* Interview Notifications */}

          <div className="p-6 flex items-center justify-between gap-5">

            <div>
              <h3 className="font-semibold text-gray-900">
                Interview Notifications
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Receive notifications about interviews and
                updates.
              </p>
            </div>

            <Toggle
              enabled={interviewNotifications}
              onChange={setInterviewNotifications}
            />

          </div>

        </div>
      </div>

      {/* =================================================
          PRIVACY SETTINGS
      ================================================= */}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">

        <div className="p-6 border-b">
          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FaUserShield />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Privacy Settings
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Control how your profile appears to other
                users.
              </p>
            </div>

          </div>
        </div>

        <div className="p-6">

          <div className="flex items-center justify-between gap-5">

            <div>
              <h3 className="font-semibold text-gray-900">
                Profile Visibility
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Allow recruiters and other users to view your
                profile.
              </p>

              <div className="flex items-center gap-2 mt-2">

                {profileVisibility ? (
                  <>
                    <FaEye className="text-green-500 text-sm" />

                    <span className="text-xs font-medium text-green-600">
                      Profile is visible
                    </span>
                  </>
                ) : (
                  <>
                    <FaEyeSlash className="text-gray-400 text-sm" />

                    <span className="text-xs font-medium text-gray-500">
                      Profile is hidden
                    </span>
                  </>
                )}

              </div>
            </div>

            <Toggle
              enabled={profileVisibility}
              onChange={setProfileVisibility}
            />

          </div>

        </div>
      </div>

      {/* =================================================
          SAVE SETTINGS BUTTON
      ================================================= */}

      <div className="flex justify-end mt-6">

        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 disabled:bg-purple-300 text-white px-6 py-3 rounded-lg transition font-medium"
        >
          {saving ? (
            <>
              <FaSyncAlt className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FaSave />
              Save Settings
            </>
          )}
        </button>

      </div>

      {/* =================================================
          CHANGE PASSWORD
      ================================================= */}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">

        <div className="p-6 border-b">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <FaLock />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Change Password
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Keep your CareerConnect account secure.
              </p>
            </div>

          </div>

        </div>

        <form
          onSubmit={handleChangePassword}
          className="p-6"
        >

          {/* Password Success */}

          {passwordSuccess && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
              <FaCheckCircle />

              {passwordSuccess}
            </div>
          )}

          {/* Password Error */}

          {passwordError && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
              <FaExclamationTriangle />

              {passwordError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* =================================================
                CURRENT PASSWORD
            ================================================= */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>

              <PasswordInput
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                placeholder="Current password"
                showPassword={showCurrentPassword}
                setShowPassword={setShowCurrentPassword}
              />

            </div>

            {/* =================================================
                NEW PASSWORD
            ================================================= */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>

              <PasswordInput
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="New password"
                showPassword={showNewPassword}
                setShowPassword={setShowNewPassword}
              />

              <p className="text-xs text-gray-400 mt-2">
                Minimum 6 characters
              </p>

            </div>

            {/* =================================================
                CONFIRM PASSWORD
            ================================================= */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>

              <PasswordInput
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm password"
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
              />

            </div>

          </div>

          {/* Password Button */}

          <div className="flex justify-end mt-6">

            <button
              type="submit"
              disabled={changingPassword}
              className="flex items-center gap-2 bg-gray-900 hover:bg-purple-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition font-medium"
            >
              {changingPassword ? (
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

      {/* =================================================
          INFORMATION
      ================================================= */}

      <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 mt-6 mb-6">

        <div className="flex gap-3">

          <FaCheckCircle className="text-purple-600 mt-1 shrink-0" />

          <div>

            <h3 className="font-semibold text-purple-900">
              Settings are saved securely
            </h3>

            <p className="text-sm text-purple-700 mt-1">
              Your preferences are stored in your CareerConnect
              account and will remain active when you log in
              again.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Setting;