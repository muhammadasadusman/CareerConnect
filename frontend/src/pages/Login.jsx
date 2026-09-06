
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
} from "react-icons/fa";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import API from "../api/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();

  // =====================================================
  // Redirect User According To Role
  // =====================================================
  const redirectUser = (user) => {
    if (!user) {
      navigate("/");
      return;
    }

    const role = user.role;

    if (role === "admin") {
      navigate("/admin-panel");
    } else if (role === "recruiter") {
      navigate("/employer-dashboard");
    } else if (role === "candidate") {
      navigate("/candidate-dashboard");
    } else {
      navigate("/");
    }
  };

  // =====================================================
  // Normal Email / Password Login
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email: email.trim(),
        password: password,
      });

      console.log("Login Success:", response.data);

      // Save JWT
      localStorage.setItem("token", response.data.token);

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Redirect according to role
      redirectUser(response.data.user);
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Google Login Success
  // =====================================================
  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setGoogleLoading(true);

    try {
      console.log("Google Response:", credentialResponse);

      if (!credentialResponse?.credential) {
        throw new Error("Google credential was not received.");
      }

      const response = await API.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      console.log("Google Login Success:", response.data);

      // Save JWT
      localStorage.setItem("token", response.data.token);

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Redirect according to role
      redirectUser(response.data.user);
    } catch (error) {
      console.error("Google Login Error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Google login failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  // =====================================================
  // Google Login Error
  // =====================================================
  const handleGoogleError = () => {
    console.error("Google Login Failed");

    setError(
      "Google login was cancelled or failed. Please try again."
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-3xl font-bold text-gray-900">
              Career
              <span className="text-purple-600">
                Connect
              </span>
            </h1>
          </Link>

          <p className="text-gray-500 mt-2">
            Welcome back! Login to your account
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

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
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                autoComplete="email"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <button
                type="button"
                className="text-sm text-purple-600 hover:text-purple-800 transition"
              >
                Forgot Password?
              </button>
            </div>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                autoComplete="current-password"
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

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 accent-purple-600"
            />

            <label
              htmlFor="remember"
              className="text-sm text-gray-600"
            >
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-purple-600 hover:bg-yellow-600 disabled:opacity-60 text-white py-3 rounded-lg font-medium transition"
          >
            {loading
              ? "Logging in..."
              : "Login"}
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


<div className="w-full flex justify-center relative">
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={handleGoogleError}
    text="continue_with"
    shape="rectangular"
  />

  {googleLoading && (
    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
      <span className="text-sm text-gray-600">
        Signing in with Google...
      </span>
    </div>
  )}
</div>


        {/* Register Link */}
        <p className="text-center text-sm text-gray-500 mt-7">
          Don't have an account?

          <Link
            to="/register"
            className="text-purple-600 font-medium ml-1 hover:text-purple-800 transition"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

