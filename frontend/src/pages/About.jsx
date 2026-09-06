import {
  FaBriefcase,
  FaUsers,
  FaBuilding,
  FaCheckCircle,
  FaSearch,
  FaUserTie,
} from "react-icons/fa";

const About = () => {
  const stats = [
    {
      number: "10,000+",
      title: "Jobs Available",
      icon: <FaBriefcase />,
    },
    {
      number: "5,000+",
      title: "Companies",
      icon: <FaBuilding />,
    },
    {
      number: "15,000+",
      title: "Active Candidates",
      icon: <FaUsers />,
    },
    {
      number: "95%",
      title: "Success Rate",
      icon: <FaCheckCircle />,
    },
  ];

  const features = [
    {
      icon: <FaSearch />,
      title: "Find Your Dream Job",
      description:
        "Search thousands of opportunities from leading companies and find a job that matches your skills.",
    },
    {
      icon: <FaUserTie />,
      title: "Build Your Career",
      description:
        "Create your professional profile and showcase your skills, experience and achievements.",
    },
    {
      icon: <FaBuilding />,
      title: "Connect With Companies",
      description:
        "Discover top companies and connect with employers looking for talented professionals.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#070B2B] text-white py-20 sm:py-24">

        {/* Purple Glow */}
        <div className="absolute -left-40 top-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

          <div className="max-w-3xl mx-auto text-center">

            <p className="text-purple-400 font-medium mb-3">
              About CareerConnect
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              Connecting Talent With
              <span className="text-purple-500"> Opportunity</span>
            </h1>

            <p className="text-gray-300 mt-6 text-base sm:text-lg leading-8">
              CareerConnect is a modern job portal designed to connect talented
              professionals with companies and opportunities that help them
              build successful careers.
            </p>

          </div>

        </div>

      </section>


      {/* About Content */}
      <section className="py-16 sm:py-20">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>

              <p className="text-purple-600 font-semibold mb-3">
                Who We Are
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Your Career Journey Starts Here
              </h2>

              <p className="text-gray-600 mt-6 leading-7">
                CareerConnect is built to make the job search simple,
                transparent and effective. We bring job seekers and employers
                together on one powerful platform.
              </p>

              <p className="text-gray-600 mt-4 leading-7">
                Whether you are looking for your first opportunity, changing
                careers or searching for experienced professionals for your
                company, CareerConnect helps you find the right match.
              </p>


              <div className="mt-7 space-y-4">

                {[
                  "Thousands of verified job opportunities",
                  "Easy and powerful job search",
                  "Connect with leading companies",
                  "Simple and professional experience",
                ].map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <FaCheckCircle className="text-purple-600 shrink-0" />

                    <span className="text-gray-700">
                      {item}
                    </span>
                  </div>

                ))}

              </div>

            </div>


            {/* Right */}
            <div className="bg-[#070B2B] rounded-2xl p-8 sm:p-10 shadow-2xl">

              <div className="grid grid-cols-2 gap-5">

                {stats.map((stat) => (

                  <div
                    key={stat.title}
                    className="bg-white/10 border border-white/10 rounded-xl p-5 text-center"
                  >

                    <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl">
                      {stat.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-white mt-4">
                      {stat.number}
                    </h3>

                    <p className="text-gray-400 text-sm mt-1">
                      {stat.title}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* What We Offer */}
      <section className="bg-white py-16 sm:py-20">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center max-w-2xl mx-auto">

            <p className="text-purple-600 font-semibold">
              Why CareerConnect
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Everything You Need To Grow
            </h2>

            <p className="text-gray-500 mt-4">
              We provide the tools and opportunities you need to take the
              next step in your career.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">

            {features.map((feature) => (

              <div
                key={feature.title}
                className="bg-gray-50 rounded-xl p-7 shadow-lg hover:-translate-y-1 hover:shadow-2xl transition duration-300"
              >

                <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mt-6">
                  {feature.title}
                </h3>

                <p className="text-gray-500 mt-3 leading-7">
                  {feature.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* Mission */}
      <section className="py-16 sm:py-20">

        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          <div className="bg-[#070B2B] rounded-2xl text-center px-6 py-12 sm:px-12 sm:py-16 shadow-2xl">

            <p className="text-purple-400 font-semibold">
              Our Mission
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
              Helping People Build Better Futures
            </h2>

            <p className="text-gray-300 max-w-2xl mx-auto mt-5 leading-7">
              Our mission is to make career opportunities accessible to
              everyone while helping companies discover talented people who
              can make a real difference.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
};

export default About;