
import JobCard from "./JobCard";

const FeaturedJobs = () => {
  const jobs = [
    {
      company: "Google",
      title: "Frontend Developer",
      image: "/uploads/job-logos/frontend.jpg",
      logoBg: "bg-blue-100 text-blue-600",
      location: "Lahore, Pakistan",
      salary: "PKR 120,000 - 180,000",
      type: "Full Time • Onsite",
      posted: "2 days ago",
      time: "Tech Company",
    },

    {
      company: "Microsoft",
      title: "React Developer",
      image: "/uploads/job-logos/react.jpg",
      logoBg: "bg-green-100 text-green-600",
      location: "Karachi, Pakistan",
      salary: "PKR 150,000 - 220,000",
      type: "Full Time • Onsite",
      posted: "3 days ago",
      time: "Software Company",
    },

    {
      company: "Airhub",
      title: "UI/UX Designer",
      image: "/uploads/job-logos/uiux.jpg",
      logoBg: "bg-orange-100 text-orange-600",
      location: "Islamabad, Pakistan",
      salary: "PKR 80,000 - 120,000",
      type: "Full Time • Onsite",
      posted: "1 day ago",
      time: "Design Agency",
    },

    {
      company: "Netflix",
      title: "Backend Developer (Node.js)",
      image: "/uploads/job-logos/backend.jpg",
      logoBg: "bg-red-100 text-red-600",
      location: "Remote, Pakistan",
      salary: "PKR 200,000 - 350,000",
      type: "Full Time • Remote",
      posted: "4 days ago",
      time: "Entertainment",
    },

    {
      company: "Twilio",
      title: "Full Stack Developer",
      image: "/uploads/job-logos/fullstack.jpg",
      logoBg: "bg-gray-200 text-gray-900",
      location: "Lahore, Pakistan",
      salary: "PKR 180,000 - 280,000",
      type: "Full Time • Onsite",
      posted: "2 days ago",
      time: "Cloud Company",
    },

    {
      company: "Fiverr",
      title: "Product Designer",
      image: "/uploads/job-logos/product.jpg",
      logoBg: "bg-green-100 text-green-700",
      location: "Karachi, Pakistan",
      salary: "PKR 100,000 - 160,000",
      type: "Full Time • Remote",
      posted: "3 days ago",
      time: "Freelance Platform",
    },
  ];

  console.log("FEATURED JOBS:", jobs);

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Featured Jobs
        </h2>

        <p className="text-gray-500 text-center mt-2">
          Explore latest opportunities from top companies
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {jobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;

