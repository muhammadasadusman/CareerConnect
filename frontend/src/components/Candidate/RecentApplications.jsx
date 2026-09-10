import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaArrowRight, FaBriefcase } from "react-icons/fa";
import { getImageUrl, getInitials } from "../../utils/imageUrl";

const getStatusBadge = (status) => {
  switch (status) {
    case "Interview":
      return "bg-green-50 text-green-700 border-green-200";
    case "Shortlisted":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Reviewed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200";
    case "Hired":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }
};

const RecentApplications = ({ applications = [], loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
        Loading recent applications...
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
        <FaBriefcase className="text-gray-400 text-3xl mx-auto mb-2" />
        <p className="text-gray-600 font-medium">No applications submitted yet.</p>
        <p className="text-sm text-gray-400 mt-1">
          Apply to jobs to track your application status here.
        </p>
        <Link
          to="/jobs"
          className="mt-4 inline-block bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
        >
          Explore Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
          <p className="text-sm text-gray-500">Track your latest job applications</p>
        </div>
        <Link
          to="/candidate-applications"
          className="text-purple-600 font-semibold hover:text-purple-800 text-sm flex items-center gap-1"
        >
          View All <FaArrowRight className="text-xs" />
        </Link>
      </div>

      <div className="space-y-4">
        {applications.slice(0, 5).map((app) => {
          const job = app.job || {};
          const company = job.company || {};
          const companyName = company.name || "Company";
          const logoUrl = getImageUrl(company.logo || job.jobLogo);

          return (
            <div
              key={app._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:border-purple-200 transition duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={companyName}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.display = "flex";
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className={`${
                      logoUrl ? "hidden" : "flex"
                    } w-full h-full items-center justify-center bg-purple-100 text-purple-600 font-bold`}
                  >
                    {getInitials(companyName)}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                    {job.title || "Job Title"}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                    <span>{companyName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-purple-500" />
                      {job.location || "Remote"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusBadge(
                    app.status
                  )}`}
                >
                  {app.status || "Applied"}
                </span>

                <Link
                  to={`/jobs/${job._id}`}
                  className="text-xs text-gray-500 hover:text-purple-600 font-medium"
                >
                  View Job
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentApplications;
