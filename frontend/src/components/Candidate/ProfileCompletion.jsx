import { Link } from "react-router-dom";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";

const ProfileCompletion = ({ profile }) => {
  let score = 0;
  if (profile?.name) score += 20;
  if (profile?.email) score += 20;
  if (profile?.phone) score += 20;
  if (profile?.location) score += 20;
  if (profile?.profileImage) score += 20;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Profile Completion</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Complete your profile to increase visibility to recruiters.
          </p>
        </div>
        <span className="font-extrabold text-purple-600 text-xl">{score}%</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-600 to-yellow-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${score}%` }}
        ></div>
      </div>

      {score < 100 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {score < 60
              ? "Add phone, location, and photo to complete"
              : "Almost done! Add missing details."}
          </span>
          <Link
            to="/candidate-profile"
            className="text-purple-600 font-semibold hover:text-purple-800 inline-flex items-center gap-1"
          >
            Update Profile <FaArrowRight className="text-xs" />
          </Link>
        </div>
      )}

      {score === 100 && (
        <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
          <FaCheckCircle /> Your profile is 100% complete!
        </div>
      )}
    </div>
  );
};

export default ProfileCompletion;
