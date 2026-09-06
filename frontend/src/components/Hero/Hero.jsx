
import { useEffect, useState } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaBriefcase,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// ==========================================
// CareerConnect Background Images
// ==========================================
import carrer from "../../assets/career.jpg";
import career1 from "../../assets/career-1.jpg";
import career2 from "../../assets/career-2.jpg";

const Hero = () => {
  const navigate = useNavigate();

  // ==========================================
  // Search States
  // ==========================================
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  // ==========================================
  // Background Images
  // ==========================================
  const backgrounds = [
    carrer,
    career1,
    career2,
  ];

  const [currentBackground, setCurrentBackground] = useState(0);

  // ==========================================
  // Automatic Background Slider
  // Changes Every 5 Seconds
  // ==========================================
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((previous) => {
        return (previous + 1) % backgrounds.length;
      });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ==========================================
  // Search Jobs
  // ==========================================
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.append("search", keyword.trim());
    }

    if (category.trim()) {
      params.append("category", category.trim());
    }

    if (location.trim()) {
      params.append("location", location.trim());
    }

    const query = params.toString();

    if (query) {
      navigate(`/jobs?${query}`);
    } else {
      navigate("/jobs");
    }
  };

  // ==========================================
  // Enter Key Search
  // ==========================================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ==========================================
  // Popular Search
  // ==========================================
  const handlePopularSearch = (item) => {
    setKeyword(item);
    setCategory("");
    setLocation("");

    navigate(
      `/jobs?search=${encodeURIComponent(item)}`
    );
  };

  // ==========================================
  // Manual Background Change
  // ==========================================
  const changeBackground = (index) => {
    setCurrentBackground(index);
  };

  return (
    <section className="relative overflow-hidden min-h-[650px]">

      {/* ========================================
          BACKGROUND IMAGES
      ======================================== */}
      <div className="absolute inset-0">

        {backgrounds.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`CareerConnect background ${index + 1}`}
            className={`
              absolute
              inset-0
              w-full
              h-full
              object-cover
              transition-opacity
              duration-1000
              ease-in-out
              ${
                currentBackground === index
                  ? "opacity-100"
                  : "opacity-0"
              }
            `}
          />
        ))}

        {/* ========================================
            DARK OVERLAY
        ======================================== */}
        <div className="absolute inset-0 bg-[#070B2B]/45"></div>

        {/* ========================================
            GRADIENT OVERLAY
        ======================================== */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B2B]/75 via-[#070B2B]/40 to-purple-950/20"></div>

      </div>

      {/* ========================================
          PURPLE GLOW - LEFT
      ======================================== */}
      <div className="absolute -left-40 top-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>

      {/* ========================================
          PURPLE GLOW - RIGHT
      ======================================== */}
      <div className="absolute -right-40 bottom-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

      {/* ========================================
          HERO CONTENT
      ======================================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-36 sm:pt-32 md:pt-28 pb-20">

        <div className="max-w-3xl">

          {/* ========================================
              BADGE
          ======================================== */}
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/20 text-purple-300 px-4 py-2 rounded-full text-sm mb-6 backdrop-blur-sm">

            <FaBriefcase />

            #1 Job Portal in Pakistan

          </div>

          {/* ========================================
              HEADING
          ======================================== */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white">

            Find Your Dream Job

            <br />

            <span className="text-purple-500">
              Build Your Future
            </span>

          </h1>

          {/* ========================================
              DESCRIPTION
          ======================================== */}
          <p className="text-gray-300 mt-6 max-w-lg text-base sm:text-lg">

            Discover thousands of job opportunities with top companies
            and take the next step in your career.

          </p>

          {/* ========================================
              SEARCH BOX
          ======================================== */}
          <div className="mt-8 bg-white rounded-xl p-3 flex flex-col md:flex-row gap-3 shadow-xl w-full">

            {/* ----------------------------------------
                KEYWORD
            ---------------------------------------- */}
            <div className="flex items-center gap-3 flex-1 px-4">

              <FaSearch className="text-gray-400 shrink-0" />

              <input
                type="text"
                value={keyword}
                onChange={(e) =>
                  setKeyword(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Job title, keywords or company"
                className="outline-none w-full text-sm text-gray-700 py-2"
              />

            </div>

            {/* ----------------------------------------
                CATEGORY
            ---------------------------------------- */}
            <div className="flex items-center gap-3 flex-[1.3] px-4 border-t md:border-t-0 md:border-l">

              <FaBriefcase className="text-gray-400 shrink-0" />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="outline-none w-full text-sm text-gray-700 min-w-0 py-2 bg-transparent"
              >

                <option value="">
                  All Categories
                </option>

                <option value="Frontend Developer">
                  Frontend Developer
                </option>

                <option value="Backend Developer">
                  Backend Developer
                </option>

                <option value="UI/UX Designer">
                  UI/UX Designer
                </option>

              </select>

            </div>

            {/* ----------------------------------------
                LOCATION
            ---------------------------------------- */}
            <div className="flex items-center gap-3 flex-1 px-4 border-t md:border-t-0 md:border-l">

              <FaMapMarkerAlt className="text-gray-400 shrink-0" />

              <input
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Location"
                className="outline-none w-full text-sm text-gray-700 py-2"
              />

            </div>

            {/* ----------------------------------------
                SEARCH BUTTON
            ---------------------------------------- */}
            <button
              type="button"
              onClick={handleSearch}
              className="bg-purple-600 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg transition duration-300 w-full md:w-auto"
            >
              Search Jobs
            </button>

          </div>

          {/* ========================================
              POPULAR SEARCHES
          ======================================== */}
          <div className="mt-5 flex flex-wrap gap-3 items-center justify-center md:justify-start">

            <span className="text-gray-300 text-sm">
              Popular Searches:
            </span>

            {[
              "Frontend Developer",
              "React Developer",
              "UI/UX Designer",
              "Node.js Developer",
            ].map((item) => (

              <button
                type="button"
                key={item}
                onClick={() =>
                  handlePopularSearch(item)
                }
                className="bg-white/10 hover:bg-purple-600 text-gray-200 hover:text-white px-3 py-1 rounded-full text-xs transition duration-300 cursor-pointer backdrop-blur-sm"
              >
                {item}
              </button>

            ))}

          </div>

        </div>

      </div>

      {/* ========================================
          SLIDER DOTS
      ======================================== */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">

        {backgrounds.map((_, index) => (

          <button
            key={index}
            type="button"
            onClick={() => changeBackground(index)}
            aria-label={`Show background ${index + 1}`}
            className={`
              h-2
              rounded-full
              transition-all
              duration-300
              ${
                currentBackground === index
                  ? "w-8 bg-purple-500"
                  : "w-2 bg-white/50 hover:bg-white"
              }
            `}
          />

        ))}

      </div>

    </section>
  );
};

export default Hero;

