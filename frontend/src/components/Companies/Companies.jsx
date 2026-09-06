import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaBuilding,
} from "react-icons/fa";

import CompanyCard from "./CompanyCard";
import API from "../../api/api";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH COMPANIES
  // ==========================================

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/companies");

        console.log("Companies API Response:", response.data);

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.companies || [];

        console.log("Companies:", data);

        setCompanies(data);
      } catch (err) {
        console.error("Companies Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load companies."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // ==========================================
  // LEFT SCROLL
  // ==========================================

  const scrollLeft = () => {
    document
      .getElementById("companies-slider")
      ?.scrollBy({
        left: -300,
        behavior: "smooth",
      });
  };

  // ==========================================
  // RIGHT SCROLL
  // ==========================================

  const scrollRight = () => {
    document
      .getElementById("companies-slider")
      ?.scrollBy({
        left: 300,
        behavior: "smooth",
      });
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Top Companies
            </h2>

            <p className="text-gray-500 mt-2">
              Work with world's leading companies
            </p>
          </div>

          {/* ARROWS */}
          <div className="flex gap-3">

            <button
              onClick={scrollLeft}
              className="
                w-10 h-10
                rounded-full
                bg-white
                shadow
                flex
                items-center
                justify-center
                hover:bg-purple-600
                hover:text-white
                transition
              "
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={scrollRight}
              className="
                w-10 h-10
                rounded-full
                bg-white
                shadow
                flex
                items-center
                justify-center
                hover:bg-purple-600
                hover:text-white
                transition
              "
            >
              <FaChevronRight />
            </button>

          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-10">
            <div
              className="
                w-10
                h-10
                border-4
                border-purple-200
                border-t-purple-600
                rounded-full
                animate-spin
              "
            ></div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div
            className="
              bg-red-50
              border
              border-red-200
              text-red-600
              rounded-xl
              p-5
              text-center
            "
          >
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          companies.length === 0 && (
            <div className="bg-white rounded-xl shadow p-8 text-center">

              <FaBuilding
                className="
                  text-purple-600
                  text-4xl
                  mx-auto
                  mb-3
                "
              />

              <h3 className="font-bold text-gray-900">
                No companies found
              </h3>

              <p className="text-gray-500 mt-1">
                Companies will appear here when they are added.
              </p>

            </div>
          )}

        {/* COMPANIES */}
        {!loading && companies.length > 0 && (
          <div
            id="companies-slider"
            className="
              flex
              gap-6
              overflow-x-auto
              scroll-smooth
              pb-4
              scrollbar-hide
            "
          >
            {companies.map((company) => (
              <CompanyCard
                key={company._id}
                company={{
                  ...company,

                  // Keep backend logo exactly as it is
                  logo: company.logo || "",

                  // Jobs count
                  jobs:
                    company.jobsCount !== undefined
                      ? company.jobsCount
                      : 0,
                }}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Companies;