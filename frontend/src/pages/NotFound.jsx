import { Link } from "react-router-dom";
import { FaHome, FaBriefcase, FaExclamationTriangle } from "react-icons/fa";
import Navbar from "../components/Navbar/Navbar";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-32">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-100">
          <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto text-4xl shadow-inner mb-6">
            <FaExclamationTriangle className="text-purple-600" />
          </div>

          <h1 className="text-6xl font-black text-gray-900 tracking-tight">
            4<span className="text-purple-600">0</span>4
          </h1>

          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            Page Not Found
          </h2>

          <p className="text-gray-500 text-sm sm:text-base mt-3 leading-relaxed">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg"
            >
              <FaHome />
              Back to Home
            </Link>

            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition duration-200"
            >
              <FaBriefcase />
              Browse Jobs
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
