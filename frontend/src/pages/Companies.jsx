import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaArrowRight,
  FaSearch,
  FaBuilding,
  FaSyncAlt,
} from "react-icons/fa";

import Navbar from "../components/Navbar/Navbar";
import API from "../api/api";
import { getImageUrl, getInitials } from "../utils/imageUrl";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/companies");
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.companies || [];

        setCompanies(data);
      } catch (err) {
        console.error("Companies Error:", err);
        setError(
          err.response?.data?.message || "Failed to load companies."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const name = company.name || "";
    const location = company.location || "";
    const query = search.toLowerCase();

    return (
      name.toLowerCase().includes(query) ||
      location.toLowerCase().includes(query)
    );
  });

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="bg-[#070B2B] text-white pt-32 pb-20 relative overflow-hidden">
        {/* Purple Glow */}
        <div className="absolute -right-40 top-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-purple-400 font-medium mb-3">
              CareerConnect
            </p>

            <h1 className="text-4xl sm:text-5xl font-bold">
              Top Companies
            </h1>

            <p className="text-gray-300 mt-5 text-base sm:text-lg">
              Explore leading companies and discover exciting career
              opportunities to build your future.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SEARCH + COMPANIES ================= */}
      <section className="py-14 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="bg-white rounded-xl shadow-md p-3 flex items-center gap-3 border border-gray-100">
              <FaSearch className="text-gray-400 ml-2" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies by name or location..."
                className="w-full outline-none text-gray-700 bg-transparent text-sm sm:text-base"
              />

              <button
                type="submit"
                className="bg-purple-600 hover:bg-yellow-600 active:scale-95 text-white px-5 py-2.5 rounded-lg transition text-sm font-medium"
              >
                Search
              </button>
            </div>
          </form>

          {/* Heading */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Explore Companies
              </h2>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Find your next opportunity with top employers.
              </p>
            </div>

            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg self-start sm:self-auto">
              {filteredCompanies.length} Companies Available
            </span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <FaSyncAlt className="text-purple-600 text-3xl animate-spin" />
              <p className="text-gray-500 mt-4 text-sm">
                Loading companies...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-5 text-center max-w-lg mx-auto">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-sm font-semibold underline hover:text-red-800"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ================= COMPANY CARDS ================= */}
          {!loading && !error && filteredCompanies.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => {
                const logoUrl = getImageUrl(company.logo);
                const companyId = company._id || company.id;

                return (
                  <div
                    key={companyId}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 hover:-translate-y-1 transition duration-300 border border-gray-100 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top */}
                      <div className="flex items-start justify-between gap-4">
                        {/* Logo */}
                        <Link
                          to={`/companies/${companyId}`}
                          className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 hover:border-purple-400 transition shrink-0"
                        >
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={`${company.name} logo`}
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                if (e.currentTarget.nextElementSibling) {
                                  e.currentTarget.nextElementSibling.style.display =
                                    "flex";
                                }
                              }}
                            />
                          ) : null}

                          <div
                            className={`${
                              logoUrl ? "hidden" : "flex"
                            } w-full h-full items-center justify-center bg-purple-100 text-purple-600 font-bold text-xl`}
                          >
                            {getInitials(company.name)}
                          </div>
                        </Link>

                        {/* Details Arrow */}
                        <Link
                          to={`/companies/${companyId}`}
                          aria-label={`View ${company.name} details`}
                          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-500 hover:bg-purple-50 transition"
                        >
                          <FaArrowRight className="text-sm" />
                        </Link>
                      </div>

                      {/* Company Name */}
                      <Link
                        to={`/companies/${companyId}`}
                        className="block text-xl font-bold text-gray-900 mt-5 hover:text-purple-600 transition"
                      >
                        {company.name}
                      </Link>

                      {/* Location */}
                      <p className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <FaMapMarkerAlt className="text-purple-500 shrink-0" />
                        <span>{company.location || "Location not specified"}</span>
                      </p>

                      {/* Description */}
                      <p className="text-sm text-gray-500 mt-4 leading-6 line-clamp-2">
                        {company.description ||
                          "Explore career opportunities at this company."}
                      </p>
                    </div>

                    {/* Bottom */}
                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                      <span className="flex items-center gap-2 text-sm font-medium text-purple-600">
                        <FaBriefcase />
                        {company.industry || "Technology"}
                      </span>

                      {/* View Company */}
                      <Link
                        to={`/companies/${companyId}`}
                        className="text-sm font-medium text-gray-700 hover:text-purple-600 transition flex items-center gap-1"
                      >
                        View Profile
                        <FaArrowRight className="text-xs" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && filteredCompanies.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto p-8">
              <div className="text-gray-400 text-5xl mb-4">
                <FaBuilding className="mx-auto" />
              </div>

              <h3 className="text-xl font-semibold text-gray-800">
                No companies found
              </h3>

              <p className="text-gray-500 mt-2 text-sm">
                {search
                  ? "Try searching for another company or clear your search query."
                  : "Companies will appear here once added."}
              </p>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Companies;
