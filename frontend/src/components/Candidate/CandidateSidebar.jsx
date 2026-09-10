import { Link, useLocation } from "react-router-dom";
import {
  FaBriefcase,
  FaBookmark,
  FaFileAlt,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

const CandidateSidebar = ({ sidebarOpen, setSidebarOpen, handleLogout }) => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/candidate-dashboard", icon: <FaBriefcase /> },
    { name: "Applications", path: "/candidate-applications", icon: <FaFileAlt /> },
    { name: "Saved Jobs", path: "/saved-jobs", icon: <FaBookmark /> },
    { name: "My Profile", path: "/candidate-profile", icon: <FaUser /> },
    { name: "Settings", path: "/candidate-settings", icon: <FaCog /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen bg-[#070B2B] text-white flex flex-col justify-between transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div>
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <Link to="/" className="text-xl font-bold tracking-wide">
            Career<span className="text-purple-400">Connect</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        {/* Links */}
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default CandidateSidebar;
