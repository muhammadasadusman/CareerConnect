import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin-panel";
    if (user.role === "recruiter") return "/employer-dashboard";
    return "/candidate-dashboard";
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "Companies", path: "/companies" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50
        bg-[#070B2B]/95
        backdrop-blur-md
        border-b border-purple-400/20
        shadow-lg
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 sm:h-24 flex items-center justify-between">
          {/* ==========================
              Logo
          ========================== */}
          <NavLink
            to="/"
            className="
              text-2xl sm:text-3xl
              font-extrabold
              text-purple-400
              tracking-wide
              transition
              hover:text-purple-300
            "
          >
            CareerConnect
          </NavLink>

          {/* ==========================
              Desktop Navigation
          ========================== */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `
                  text-[15px] xl:text-[16px]
                  font-medium
                  transition-all duration-300
                  ${isActive ? "text-purple-400" : "text-white"}
                  hover:text-yellow-500
                  `
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* ==========================
              Desktop Buttons
          ========================== */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {user ? (
              <>
                {/* Dashboard Link */}
                <Link
                  to={getDashboardPath()}
                  className="
                    flex items-center gap-2
                    px-4 xl:px-5
                    py-2
                    rounded-lg
                    text-white
                    border border-purple-400/50
                    bg-purple-600/30
                    text-sm xl:text-base
                    font-medium
                    transition-all duration-300
                    hover:bg-purple-600
                    hover:text-white
                  "
                >
                  <FaUser className="text-xs" />
                  <span>
                    {user.role === "admin"
                      ? "Admin Panel"
                      : user.role === "recruiter"
                      ? "Employer Dashboard"
                      : "Dashboard"}
                  </span>
                </Link>

                {/* Post a Job for Recruiter or Logout */}
                {user.role === "recruiter" && (
                  <Link
                    to="/post-job"
                    className="
                      text-white
                      border border-white/70
                      text-sm xl:text-base
                      font-semibold
                      px-4 xl:px-5
                      py-2
                      rounded-lg
                      transition-all duration-300
                      hover:bg-yellow-600
                      hover:border-yellow-600
                    "
                  >
                    Post a Job
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="
                    flex items-center gap-2
                    px-4 xl:px-5
                    py-2
                    rounded-lg
                    text-white
                    border border-red-400/60
                    bg-red-500/20
                    text-sm xl:text-base
                    font-medium
                    transition-all duration-300
                    hover:bg-red-600
                    hover:text-white
                  "
                >
                  <FaSignOutAlt className="text-xs" />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <NavLink
                  to="/login"
                  className="
                    px-4 xl:px-5
                    py-2
                    rounded-lg
                    text-white
                    border border-white/70
                    text-sm xl:text-base
                    font-medium
                    transition-all duration-300
                    hover:bg-yellow-600
                    hover:text-white
                    hover:border-yellow-600
                  "
                >
                  Login
                </NavLink>

                {/* Sign Up */}
                <NavLink
                  to="/register"
                  className="
                    px-4 xl:px-5
                    py-2
                    rounded-lg
                    text-white
                    border border-white/70
                    text-sm xl:text-base
                    font-medium
                    transition-all duration-300
                    hover:bg-yellow-600
                    hover:text-white
                    hover:border-yellow-600
                  "
                >
                  Sign Up
                </NavLink>

                {/* Post a Job */}
                <Link
                  to="/post-job"
                  className="
                    text-white
                    border border-white/70
                    text-sm xl:text-base
                    font-semibold
                    px-5 xl:px-6
                    py-2.5 xl:py-3
                    rounded-lg
                    transition-all duration-300
                    hover:bg-yellow-600
                    hover:border-yellow-600
                  "
                >
                  Post a Job
                </Link>
              </>
            )}
          </div>

          {/* ==========================
              Mobile Menu Button
          ========================== */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              lg:hidden
              text-white
              text-3xl sm:text-4xl
              hover:text-yellow-500
              transition
            "
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>

        {/* ==========================
            Mobile Menu
        ========================== */}
        {menuOpen && (
          <div
            className="
              lg:hidden
              mt-2 mb-4
              rounded-2xl
              bg-[#1A1045]/98
              backdrop-blur-xl
              border border-purple-400/20
              shadow-xl
              p-5 sm:p-6
            "
          >
            <div className="flex flex-col items-center gap-4">
              {/* Mobile Links */}
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `
                    font-medium
                    transition
                    ${isActive ? "text-purple-400" : "text-white"}
                    hover:text-yellow-500
                    `
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {user ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMenuOpen(false)}
                    className="
                      w-full
                      text-center
                      px-5
                      py-2.5
                      rounded-lg
                      text-white
                      bg-purple-600
                      font-medium
                      transition
                      hover:bg-yellow-600
                    "
                  >
                    {user.role === "admin"
                      ? "Admin Panel"
                      : user.role === "recruiter"
                      ? "Employer Dashboard"
                      : "Candidate Dashboard"}
                  </Link>

                  {user.role === "recruiter" && (
                    <Link
                      to="/post-job"
                      onClick={() => setMenuOpen(false)}
                      className="
                        w-full
                        text-center
                        py-2.5
                        rounded-lg
                        text-white
                        border border-white/70
                        font-semibold
                        transition
                        hover:bg-yellow-600
                        hover:border-yellow-600
                      "
                    >
                      Post a Job
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="
                      w-full
                      text-center
                      px-5
                      py-2.5
                      rounded-lg
                      text-white
                      bg-red-600/80
                      font-medium
                      transition
                      hover:bg-red-700
                    "
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Mobile Login */}
                  <NavLink
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="
                      w-full
                      text-center
                      px-5
                      py-2.5
                      rounded-lg
                      text-white
                      border border-white/70
                      font-medium
                      transition
                      hover:bg-yellow-600
                      hover:border-yellow-600
                    "
                  >
                    Login
                  </NavLink>

                  {/* Mobile Sign Up */}
                  <NavLink
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="
                      w-full
                      text-center
                      px-5
                      py-2.5
                      rounded-lg
                      text-white
                      border border-white/70
                      font-medium
                      transition
                      hover:bg-yellow-600
                      hover:border-yellow-600
                    "
                  >
                    Sign Up
                  </NavLink>

                  {/* Mobile Post Job */}
                  <Link
                    to="/post-job"
                    onClick={() => setMenuOpen(false)}
                    className="
                      w-full
                      text-center
                      mt-1
                      py-3
                      rounded-lg
                      text-white
                      border border-white/70
                      font-semibold
                      transition
                      hover:bg-yellow-600
                      hover:border-yellow-600
                    "
                  >
                    Post a Job
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
