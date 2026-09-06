
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaArrowRight,
  FaSearch,
} from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

const Companies = () => {
  const [search, setSearch] = useState("");

  const BACKEND_URL = "http://localhost:5000";

  const companies = [
    {
      id: "google",
      name: "Google",
      location: "Lahore, Pakistan",
      jobs: "120+ Jobs",
      logo: "google.png",
      description:
        "Build innovative products and technologies used by millions of people worldwide.",
    },
    {
      id: "microsoft",
      name: "Microsoft",
      location: "Karachi, Pakistan",
      jobs: "95+ Jobs",
      logo: "microsoft.png",
      description:
        "Join a global technology company creating solutions that empower every person.",
    },
    {
      id: "netflix",
      name: "Netflix",
      location: "Islamabad, Pakistan",
      jobs: "80+ Jobs",
      logo: "netflix.png",
      description:
        "Help create the future of entertainment with a team of talented professionals.",
    },
    {
      id: "airhub",
      name: "Airhub",
      location: "Islamabad, Pakistan",
      jobs: "65+ Jobs",
      logo: "airhub.png",
      description:
        "Work with a growing technology team building modern digital experiences.",
    },
    {
      id: "twilio",
      name: "Twilio",
      location: "Lahore, Pakistan",
      jobs: "110+ Jobs",
      logo: "twilio.png",
      description:
        "Build communication solutions that connect businesses with their customers.",
    },
    {
      id: "fiverr",
      name: "Fiverr",
      location: "Lahore, Pakistan",
      jobs: "75+ Jobs",
      logo: "fiver.png",
      description:
        "Connect talented professionals with businesses and opportunities worldwide.",
    },
  ];

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HERO ================= */}
      <section className="bg-[#070B2B] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="bg-white rounded-xl shadow-md p-3 flex items-center gap-3">

              <FaSearch className="text-gray-400 ml-2" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies..."
                className="w-full outline-none text-gray-700 bg-transparent"
              />

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white px-5 py-2.5 rounded-lg transition"
              >
                Search
              </button>

            </div>
          </form>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Explore Companies
            </h2>

            <p className="text-gray-500 mt-2">
              Find your next opportunity with top employers.
            </p>
          </div>

          {/* ================= COMPANY CARDS ================= */}
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:-translate-y-1 hover:shadow-2xl transition duration-300"
                >

                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">

                    {/* Logo */}
                    <Link
                      to={`/companies/${company.id}`}
                      className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 hover:border-purple-400 transition"
                    >
                      <img
                        src={`${BACKEND_URL}/uploads/logos/${company.logo}`}
                        alt={`${company.name} logo`}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </Link>

                    {/* Company Details Arrow */}
                    <Link
                      to={`/companies/${company.id}`}
                      aria-label={`View ${company.name} details`}
                      className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-500 hover:bg-purple-50 transition"
                    >
                      <FaArrowRight className="text-sm" />
                    </Link>

                  </div>

                  {/* Company Name */}
                  <Link
                    to={`/companies/${company.id}`}
                    className="block text-xl font-bold text-gray-900 mt-5 hover:text-purple-600 transition"
                  >
                    {company.name}
                  </Link>

                  {/* Location */}
                  <p className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <FaMapMarkerAlt className="text-purple-500" />
                    {company.location}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mt-4 leading-6">
                    {company.description}
                  </p>

                  {/* Bottom */}
                  <div className="flex items-center justify-between mt-6 pt-5 border-t">

                    <span className="flex items-center gap-2 text-sm font-medium text-purple-600">
                      <FaBriefcase />
                      {company.jobs}
                    </span>

                    {/* View Jobs */}
                    <Link
                      to={`/jobs?company=${company.id}`}
                      className="text-sm font-medium text-gray-700 hover:text-purple-600 transition flex items-center gap-1"
                    >
                      View Jobs
                      <FaArrowRight className="text-xs" />
                    </Link>

                  </div>

                </div>
              ))}

            </div>
          ) : (
            /* No Results */
            <div className="text-center py-16">

              <div className="text-gray-400 text-5xl mb-4">
                <FaSearch className="mx-auto" />
              </div>

              <h3 className="text-xl font-semibold text-gray-700">
                No companies found
              </h3>

              <p className="text-gray-500 mt-2">
                Try searching for another company.
              </p>

            </div>
          )}

        </div>
      </section>

    </div>
  );
};

export default Companies;


