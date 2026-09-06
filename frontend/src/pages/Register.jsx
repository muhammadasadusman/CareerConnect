
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaBriefcase,
} from "react-icons/fa";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../api/api";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // Redirect according to role
  // =====================================================
  const redirectUser = (user) => {
    if (!user) {
      navigate("/");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin-panel");
    } else if (user.role === "recruiter") {
      navigate("/employer-dashboard");
    } else if (user.role === "candidate") {
      navigate("/candidate-dashboard");
    } else {
      navigate("/");
    }
  };

  // =====================================================
  // Normal Signup
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!role) {
      setError("Please select your account type.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!terms) {
      setError("Please agree to the Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/signup", {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      // Save authentication data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setSuccess(
        response.data.message || "Account created successfully!"
      );

      // Redirect after small delay
      setTimeout(() => {
        redirectUser(response.data.user);
      }, 700);
    } catch (err) {
      console.error("Signup Error:", err);

      setError(
        err.response?.data?.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Google Signup / Login
  // =====================================================
  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setSuccess("");

    if (!credentialResponse?.credential) {
      setError("Google authentication failed.");
      return;
    }

    try {
      setGoogleLoading(true);

      const response = await API.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      // Save JWT
      localStorage.setItem("token", response.data.token);

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setSuccess(
        response.data.message ||
          "Google account connected successfully!"
      );

      // Redirect
      setTimeout(() => {
        redirectUser(response.data.user);
      }, 700);
    } catch (err) {
      console.error("Google Signup Error:", err);

      setError(
        err.response?.data?.message ||
          "Google authentication failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setGoogleLoading(false);
    setError(
      "Google authentication failed. Please try again."
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-3xl font-bold text-gray-900">
              Career<span className="text-purple-600">Connect</span>
            </h1>
          </Link>

          <p className="text-gray-500 mt-2">
            Create your CareerConnect account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>

            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
              />
            </div>
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>

            <div className="relative">
              <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none text-gray-700 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
              >
                <option value="" disabled>
                  Select account type
                </option>

                <option value="candidate">
                  Candidate
                </option>

                <option value="recruiter">
                  Recruiter
                </option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-lg outline-none text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
              >
                {showPassword ? (
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
              Confirm Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-lg outline-none text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
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

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={terms}
              onChange={(e) =>
                setTerms(e.target.checked)
              }
              className="w-4 h-4 mt-1 accent-purple-600"
            />

            <label
              htmlFor="terms"
              className="text-sm text-gray-600"
            >
              I agree to the{" "}
              <span className="text-purple-600">
                Terms & Conditions
              </span>{" "}
              and Privacy Policy.
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-7">
          <div className="h-px bg-gray-200 flex-1"></div>

          <span className="text-sm text-gray-400">
            OR
          </span>

          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        {/* Google */}
        <div className="w-full flex justify-center">
          {googleLoading ? (
            <div className="w-full border border-gray-200 text-gray-500 py-3 rounded-lg text-center">
              Connecting with Google...
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="350"
            />
          )}
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-7">
          Already have an account?

          <Link
            to="/login"
            className="text-purple-600 font-medium ml-1 hover:text-purple-800 transition"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
