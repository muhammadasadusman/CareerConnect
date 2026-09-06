import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API from "../../api/api";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  // ==========================
  // Get Job
  // ==========================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);

        const response = await API.get(`/jobs/${id}`);

        const job = response.data;

        setFormData({
          title: job.title || "",
          description: job.description || "",
          company: job.company?._id || job.company || "",
          location: job.location || "",
          jobType: job.jobType || "Full Time",
          category: job.category || "",
          salary: job.salary || "",
          skills: Array.isArray(job.skills)
            ? job.skills.join(", ")
            : job.skills || "",
          experience: job.experience || "",
          deadline: job.deadline
            ? job.deadline.substring(0, 10)
            : "",
        });
      } catch (error) {
        console.error("Fetch Job Error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load job."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // ==========================
  // Input Change
  // ==========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================
  // Update Job
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = {
        ...formData,

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      await API.put(`/jobs/${id}`, data);

      alert("Job updated successfully!");

      navigate("/employer/jobs");
    } catch (error) {
      console.error("Update Job Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update job."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>

          <p className="text-gray-500 mt-4">
            Loading job...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <div className="bg-[#070B2B] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

          <p className="text-purple-400 text-sm">
            EMPLOYER PANEL
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold mt-1">
            Edit Job
          </h1>

          <p className="text-gray-300 text-sm mt-2">
            Update your job posting information.
          </p>

        </div>
      </div>

      {/* Form */}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Job Title */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-purple-500"
              />

            </div>

            {/* Location */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-purple-500"
              />

            </div>

            {/* Job Type */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>

              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-purple-500"
              >
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Remote</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>

            </div>

            {/* Category */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-purple-500"
              />

            </div>

            {/* Salary */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary
              </label>

              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-purple-500"
              />

            </div>

            {/* Experience */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience
              </label>

              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 1-2 Years"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-purple-500"
              />

            </div>

            {/* Deadline */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline
              </label>

              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-purple-500"
              />

            </div>

            {/* Skills */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, Tailwind CSS"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-purple-500"
              />

              <p className="text-xs text-gray-400 mt-1">
                Separate skills with commas.
              </p>

            </div>

            {/* Description */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="7"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-purple-500 resize-none"
              />

            </div>

          </div>

          {/* Buttons */}

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t">

            <button
              type="button"
              onClick={() => navigate("/employer/jobs")}
              className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-yellow-600 text-white transition disabled:opacity-60"
            >
              {saving ? "Updating..." : "Update Job"}
            </button>

          </div>

        </form>

      </main>

    </div>
  );
};

export default EditJob;