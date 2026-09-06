import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCog,
  FaBell,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import API from "../../api/api";

const CandidateSettings = () => {
  // ==========================
  // Settings State
  // ==========================
  const [jobAlerts, setJobAlerts] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);

  // ==========================
  // Password State
  // ==========================
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ==========================
  // Password Visibility
  // ==========================
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ==========================
  // Loading States
  // ==========================
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // ==========================
  // Messages
  // ==========================
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");

  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ==========================
  // Fetch Current Settings
  // ==========================
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setSettingsError("");

        const response = await API.get("/users/profile");

        const user = response.data.user;

        setJobAlerts(
          user.jobAlerts !== undefined
            ? user.jobAlerts
            : true
        );

        setProfileVisibility(
          user.profileVisibility !== undefined
            ? user.profileVisibility
            : true
        );

      } catch (error) {
        console.error("Settings Fetch Error:", error);

        setSettingsError(
          error.response?.data?.message ||
            "Failed to load settings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // ==========================
  // Save Settings
  // ==========================
  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);

      setSettingsSuccess("");
      setSettingsError("");

      const response = await API.put("/users/settings", {
        jobAlerts,
        profileVisibility,
      });

      setSettingsSuccess(
        response.data.message ||
          "Settings saved successfully"
      );

    } catch (error) {
      console.error("Settings Save Error:", error);

      setSettingsError(
        error.response?.data?.message ||
          "Failed to save settings."
      );
    } finally {
      setSavingSettings(false);
    }
  };

  // ==========================
  // Change Password
  // ==========================
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordSuccess("");
    setPasswordError("");

    // Check passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(
        "Please fill all password fields."
      );
      return;
    }

    // New password length
    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    // Confirm password
    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await API.put(
        "/users/change-password",
        {
          currentPassword,
          newPassword,
        }
      );

      setPasswordSuccess(
        response.data.message ||
          "Password changed successfully"
      );

      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error(
        "Change Password Error:",
        error
      );

      setPasswordError(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ==========================
          Header
      ========================== */}
      <header className="bg-[#070B2B] text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">

            <h1 className="text-2xl font-bold">
              Career
              <span className="text-purple-500">
                Connect
              </span>
            </h1>

            <Link
              to="/candidate-dashboard"
              className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition"
            >
              <FaArrowLeft />
              Dashboard
            </Link>

          </div>

        </div>

      </header>


      {/* ==========================
          Main
      ========================== */}
      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* ==========================
            Settings Card
        ========================== */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">

          {/* Heading */}
          <div className="flex items-center gap-4 mb-8">

            <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
              <FaCog />
            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                Settings
              </h1>

              <p className="text-gray-500">
                Manage your account settings
              </p>

            </div>

          </div>


          {/* Loading */}
          {loading ? (
            <div className="text-center py-8">

              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>

              <p className="text-gray-500 mt-3">
                Loading settings...
              </p>

            </div>
          ) : (
            <>
              {/* ==========================
                  Settings Messages
              ========================== */}

              {settingsSuccess && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                  {settingsSuccess}
                </div>
              )}

              {settingsError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {settingsError}
                </div>
              )}


              {/* ==========================
                  Notifications
              ========================== */}
              <div className="border-b pb-6 mb-6">

                <div className="flex items-center gap-3 mb-4">

                  <FaBell className="text-purple-600" />

                  <h2 className="font-semibold text-gray-900">
                    Notifications
                  </h2>

                </div>


                <label className="flex items-center justify-between gap-5 cursor-pointer">

                  <div>

                    <p className="text-gray-700">
                      Job Alerts
                    </p>

                    <p className="text-sm text-gray-500">
                      Receive notifications about new jobs.
                    </p>

                  </div>

                  <input
                    type="checkbox"
                    checked={jobAlerts}
                    onChange={(e) =>
                      setJobAlerts(e.target.checked)
                    }
                    className="w-5 h-5 accent-purple-600 cursor-pointer"
                  />

                </label>

              </div>


              {/* ==========================
                  Privacy
              ========================== */}
              <div className="border-b pb-6 mb-6">

                <div className="flex items-center gap-3 mb-4">

                  <FaLock className="text-purple-600" />

                  <h2 className="font-semibold text-gray-900">
                    Account Privacy
                  </h2>

                </div>


                <label className="flex items-center justify-between gap-5 cursor-pointer">

                  <div>

                    <p className="text-gray-700">
                      Profile Visibility
                    </p>

                    <p className="text-sm text-gray-500">
                      Allow recruiters to view your profile.
                    </p>

                  </div>

                  <input
                    type="checkbox"
                    checked={profileVisibility}
                    onChange={(e) =>
                      setProfileVisibility(
                        e.target.checked
                      )
                    }
                    className="w-5 h-5 accent-purple-600 cursor-pointer"
                  />

                </label>

              </div>


              {/* ==========================
                  Save Settings
              ========================== */}
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="bg-purple-600 hover:bg-yellow-600 disabled:opacity-60 text-white px-6 py-3 rounded-lg transition"
              >
                {savingSettings
                  ? "Saving..."
                  : "Save Settings"}
              </button>


              {/* ==========================
                  Change Password
              ========================== */}
              <div className="border-t mt-10 pt-8">

                <div className="flex items-center gap-3 mb-6">

                  <FaLock className="text-purple-600" />

                  <div>

                    <h2 className="font-semibold text-gray-900">
                      Change Password
                    </h2>

                    <p className="text-sm text-gray-500">
                      Update your account password.
                    </p>

                  </div>

                </div>


                {/* Password Messages */}

                {passwordSuccess && (
                  <div className="mb-5 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                    {passwordSuccess}
                  </div>
                )}

                {passwordError && (
                  <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {passwordError}
                  </div>
                )}


                <form
                  onSubmit={handleChangePassword}
                  className="space-y-5"
                >

                  {/* Current Password */}
                  <div>

                    <label className="text-sm text-gray-500">
                      Current Password
                    </label>

                    <div className="relative mt-2">

                      <input
                        type={
                          showCurrentPassword
                            ? "text"
                            : "password"
                        }
                        value={currentPassword}
                        onChange={(e) =>
                          setCurrentPassword(
                            e.target.value
                          )
                        }
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 pr-12 border rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(
                            !showCurrentPassword
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
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

                    <label className="text-sm text-gray-500">
                      New Password
                    </label>

                    <div className="relative mt-2">

                      <input
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(
                            e.target.value
                          )
                        }
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 pr-12 border rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            !showNewPassword
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
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

                    <label className="text-sm text-gray-500">
                      Confirm New Password
                    </label>

                    <div className="relative mt-2">

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(
                            e.target.value
                          )
                        }
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 pr-12 border rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>

                    </div>

                  </div>


                  {/* Change Password Button */}
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="bg-purple-600 hover:bg-yellow-600 disabled:opacity-60 text-white px-6 py-3 rounded-lg transition"
                  >
                    {changingPassword
                      ? "Changing Password..."
                      : "Change Password"}
                  </button>

                </form>

              </div>

            </>
          )}

        </div>

      </main>

    </div>
  );
};

export default CandidateSettings;