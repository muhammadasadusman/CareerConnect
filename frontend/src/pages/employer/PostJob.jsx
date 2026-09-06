import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaTag,
  FaClock,
  FaPlus,
} from "react-icons/fa";
import API from "../../api/api";

const PostJob = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    jobType: "Full Time",
    category: "",
    salary: "",
    skills: "",
    experience: "",
    deadline: "",
  });

  // =========================
  // Fetch Companies
  // =========================

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);

        const response = await API.get("/companies");

        setCompanies(response.data.companies || []);
      } catch (err) {
        console.error("Companies Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load companies."
        );
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  // =========================
  // Handle Input
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Submit Job
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.title ||
      !formData.description ||
      !formData.company ||
      !formData.location ||
      !formData.jobType ||
      !formData.category
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      const jobData = {
        title: formData.title,
        description: formData.description,
        company: formData.company,
        location: formData.location,
        jobType: formData.jobType,
        category: formData.category,
        salary: formData.salary,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        experience: formData.experience,
        deadline: formData.deadline || undefined,
      };

      const response = await API.post("/jobs", jobData);

      console.log("Job Created:", response.data);

      setSuccess("Job posted successfully! 🎉");

      setTimeout(() => {
        navigate("/employer-dashboard");
      }, 1200);
    } catch (err) {
      console.error("Post Job Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to post job."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* =========================
          Header
      ========================= */}

      <header className="bg-[#070B2B] text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">

            <Link to="/employer-dashboard">

              <h1 className="text-2xl sm:text-3xl font-bold">
                Career
                <span className="text-purple-500">
                  Connect
                </span>
              </h1>

            </Link>

            <Link
              to="/employer-dashboard"
              className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition"
            >
              <FaArrowLeft />
              Dashboard
            </Link>

          </div>

        </div>

      </header>


      {/* =========================
          Main
      ========================= */}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Heading */}

        <div className="mb-8">

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Post a New Job
          </h1>

          <p className="text-gray-500 mt-2">
            Create a job opening and find the right candidate.
          </p>

        </div>


        {/* Alerts */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 rounded-lg px-4 py-3">
            {success}
          </div>
        )}


        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
        >

          {/* Job Title */}

          <div className="mb-6">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Title *
            </label>

            <div className="relative">

              <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

            </div>

          </div>


          {/* Description */}

          <div className="mb-6">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="Describe the job responsibilities, requirements and duties..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />

          </div>


          {/* Company + Location */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

            {/* Company */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company *
              </label>

              <div className="relative">

                <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={loadingCompanies}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >

                  <option value="">
                    {loadingCompanies
                      ? "Loading companies..."
                      : "Select Company"}
                  </option>

                  {companies.map((company) => (
                    <option
                      key={company._id}
                      value={company._id}
                    >
                      {company.name}
                    </option>
                  ))}

                </select>

              </div>

            </div>


            {/* Location */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>

              <div className="relative">

                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Islamabad, Pakistan"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

              </div>

            </div>

          </div>


          {/* Job Type + Category */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type *
              </label>

              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>

            </div>


            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>

              <div className="relative">

                <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Web Development"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

              </div>

            </div>

          </div>


          {/* Salary + Experience */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Salary
              </label>

              <div className="relative">

                <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. 80,000 - 120,000 PKR"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

              </div>

            </div>


            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Experience
              </label>

              <div className="relative">

                <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 1-2 Years"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

              </div>

            </div>

          </div>


          {/* Skills */}

          <div className="mb-6">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Skills
            </label>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, JavaScript, HTML, CSS, Tailwind CSS"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <p className="text-xs text-gray-400 mt-2">
              Separate skills using commas.
            </p>

          </div>


          {/* Deadline */}

          <div className="mb-8">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Application Deadline
            </label>

            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

          </div>


          {/* Buttons */}

          <div className="flex flex-col sm:flex-row gap-3">

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-yellow-600 disabled:bg-gray-400 text-white py-3 rounded-lg transition font-medium"
            >

              <FaPlus />

              {submitting ? "Posting Job..." : "Post Job"}

            </button>

            <Link
              to="/employer-dashboard"
              className="flex-1 flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-lg transition font-medium"
            >
              Cancel
            </Link>

          </div>

        </form>

      </main>

    </div>
  );
};

export default PostJob;