
import {
  FaBriefcase,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#070B2B] text-white mt-auto">
      {/* ================================
          Main Footer
      ================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* ================================
              Brand
          ================================= */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-purple-600 rounded-xl flex items-center justify-center">
                <FaBriefcase className="text-white text-lg" />
              </div>

              <span className="text-xl sm:text-2xl font-bold">
                Career
                <span className="text-purple-500">
                  Connect
                </span>
              </span>
            </Link>

            <p className="text-gray-400 text-sm leading-6 mt-5 max-w-sm">
              Find your dream job and build your future
              with CareerConnect. Discover thousands of
              opportunities from top companies.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-600 transition duration-300"
              >
                <FaFacebookF className="text-sm" />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-600 transition duration-300"
              >
                <FaTwitter className="text-sm" />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-600 transition duration-300"
              >
                <FaLinkedinIn className="text-sm" />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-600 transition duration-300"
              >
                <FaInstagram className="text-sm" />
              </a>
            </div>
          </div>

          {/* ================================
              Quick Links
          ================================= */}
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-purple-400 transition duration-200 text-sm"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/jobs"
                  className="text-gray-400 hover:text-purple-400 transition duration-200 text-sm"
                >
                  Jobs
                </Link>
              </li>

              <li>
                <Link
                  to="/companies"
                  className="text-gray-400 hover:text-purple-400 transition duration-200 text-sm"
                >
                  Companies
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-purple-400 transition duration-200 text-sm"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-purple-400 transition duration-200 text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* ================================
              Job Seekers
          ================================= */}
          <div>
            <h3 className="text-lg font-semibold mb-5">
              For Job Seekers
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/jobs"
                  className="text-gray-400 hover:text-purple-400 transition duration-200 text-sm"
                >
                  Browse Jobs
                </Link>
              </li>

              <li>
                <Link
                  to="/saved-jobs"
                  className="text-gray-400 hover:text-purple-400 transition duration-200 text-sm"
                >
                  Saved Jobs
                </Link>
              </li>

              <li>
                <Link
                  to="/candidate-applications"
                  className="text-gray-400 hover:text-purple-400 transition duration-200 text-sm"
                >
                  My Applications
                </Link>
              </li>

              <li>
                <Link
                  to="/candidate-profile"
                  className="text-gray-400 hover:text-purple-400 transition duration-200 text-sm"
                >
                  My Profile
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="text-gray-400 hover:text-purple-400 transition duration-200 text-sm"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* ================================
              Contact
          ================================= */}
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Contact Us
            </h3>

            <ul className="space-y-4">
              {/* Location */}
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt className="text-purple-500 text-sm" />
                </div>

                <span className="text-gray-400 text-sm leading-6">
                  Islamabad, Pakistan
                </span>
              </li>

              {/* Phone */}
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center shrink-0">
                  <FaPhoneAlt className="text-purple-500 text-sm" />
                </div>

                <span className="text-gray-400 text-sm leading-6">
                  +92 300 1234567
                </span>
              </li>

              {/* Email */}
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center shrink-0">
                  <FaEnvelope className="text-purple-500 text-sm" />
                </div>

                <span className="text-gray-400 text-sm leading-6 break-all">
                  support@careerconnect.com
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================================
          Bottom Footer
      ================================= */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Copyright */}
            <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left">
              © {new Date().getFullYear()} CareerConnect.
              All rights reserved.
            </p>

            {/* Bottom Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <Link
                to="/privacy"
                className="text-gray-500 hover:text-purple-400 text-xs sm:text-sm transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="text-gray-500 hover:text-purple-400 text-xs sm:text-sm transition"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

