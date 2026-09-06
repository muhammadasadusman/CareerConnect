const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Job = require("./models/job");
const Company = require("./models/company");
const User = require("./models/userModel");

dotenv.config();

const createJobs = async () => {
  try {
    // ==========================
    // Connect MongoDB
    // ==========================
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    // ==========================
    // Find Recruiter
    // ==========================
    const recruiter = await User.findOne({
      email: "recruiter@test.com",
      role: "recruiter",
    });

    if (!recruiter) {
      console.log("Recruiter not found");
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log("Recruiter found:", recruiter.name);

    // ==========================
    // Companies Data
    // ==========================
    const companiesData = [
      {
        name: "Google",
        logo: "G",
        location: "Lahore, Pakistan",
      },
      {
        name: "Microsoft",
        logo: "M",
        location: "Karachi, Pakistan",
      },
      {
        name: "Netflix",
        logo: "N",
        location: "Lahore, Pakistan",
      },
      {
        name: "Twilio",
        logo: "T",
        location: "Karachi, Pakistan",
      },
      {
        name: "Fiverr",
        logo: "F",
        location: "Islamabad, Pakistan",
      },
      {
        name: "Airhub",
        logo: "A",
        location: "Islamabad, Pakistan",
      },
    ];

    // ==========================
    // Create / Find Companies
    // ==========================
    const companies = {};

    for (const companyData of companiesData) {
      let company = await Company.findOne({
        name: companyData.name,
      });

      if (!company) {
        company = await Company.create({
          ...companyData,
          recruiter: recruiter._id,
        });

        console.log(`Company created: ${companyData.name}`);
      } else {
        console.log(`Company already exists: ${companyData.name}`);
      }

      companies[companyData.name] = company._id;
    }

    // ==========================
    // Jobs Data
    // ==========================
    const jobs = [
      {
        title: "React Developer",
        description:
          "Join our team as a React Developer and build modern web applications.",
        company: companies["Microsoft"],
        location: "Karachi, Pakistan",
        jobType: "Full Time",
        category: "Frontend Developer",
        salary: "150,000 - 220,000 PKR",
        skills: [
          "React",
          "JavaScript",
          "Redux",
          "Tailwind CSS",
        ],
        experience: "2-3 Years",
        deadline: new Date("2026-10-05"),
        postedBy: recruiter._id,
      },

      {
        title: "Backend Developer (Node.js)",
        description:
          "We are hiring a Backend Developer with strong Node.js and MongoDB skills.",
        company: companies["Netflix"],
        location: "Lahore, Pakistan",
        jobType: "Remote",
        category: "Backend Developer",
        salary: "180,000 - 250,000 PKR",
        skills: [
          "Node.js",
          "Express.js",
          "MongoDB",
          "REST API",
        ],
        experience: "2-4 Years",
        deadline: new Date("2026-10-10"),
        postedBy: recruiter._id,
      },

      {
        title: "Full Stack Developer",
        description:
          "Looking for a Full Stack Developer to work on scalable web applications.",
        company: companies["Twilio"],
        location: "Karachi, Pakistan",
        jobType: "Full Time",
        category: "Full Stack Developer",
        salary: "160,000 - 230,000 PKR",
        skills: [
          "React",
          "Node.js",
          "Express.js",
          "MongoDB",
          "JavaScript",
        ],
        experience: "2-4 Years",
        deadline: new Date("2026-10-15"),
        postedBy: recruiter._id,
      },

      {
        title: "Product Designer",
        description:
          "We are looking for a creative Product Designer to improve user experiences.",
        company: companies["Fiverr"],
        location: "Islamabad, Pakistan",
        jobType: "Full Time",
        category: "UI/UX Designer",
        salary: "110,000 - 170,000 PKR",
        skills: [
          "Figma",
          "UI Design",
          "UX Design",
          "Prototyping",
        ],
        experience: "1-3 Years",
        deadline: new Date("2026-10-20"),
        postedBy: recruiter._id,
      },

      {
        title: "UI/UX Designer",
        description:
          "Design beautiful and user-friendly interfaces for modern applications.",
        company: companies["Airhub"],
        location: "Islamabad, Pakistan",
        jobType: "Full Time",
        category: "UI/UX Designer",
        salary: "100,000 - 160,000 PKR",
        skills: [
          "Figma",
          "Adobe XD",
          "UI Design",
          "UX Research",
        ],
        experience: "1-2 Years",
        deadline: new Date("2026-10-25"),
        postedBy: recruiter._id,
      },

      {
        title: "JavaScript Developer",
        description:
          "We are looking for a JavaScript Developer to build responsive and interactive web applications.",
        company: companies["Google"],
        location: "Lahore, Pakistan",
        jobType: "Full Time",
        category: "Frontend Developer",
        salary: "90,000 - 140,000 PKR",
        skills: [
          "JavaScript",
          "HTML",
          "CSS",
          "React",
        ],
        experience: "1-2 Years",
        deadline: new Date("2026-11-01"),
        postedBy: recruiter._id,
      },
    ];

    // ==========================
    // Create Jobs
    // ==========================
    for (const jobData of jobs) {
      const existingJob = await Job.findOne({
        title: jobData.title,
        company: jobData.company,
      });

      if (!existingJob) {
        await Job.create(jobData);

        console.log(`Job created: ${jobData.title}`);
      } else {
        console.log(`Job already exists: ${jobData.title}`);
      }
    }

    // ==========================
    // Finished
    // ==========================
    console.log("");
    console.log("=================================");
    console.log("All jobs processed successfully!");
    console.log("=================================");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("=================================");
    console.error("Error:", error.message);
    console.error("=================================");

    await mongoose.connection.close();

    process.exit(1);
  }
};

createJobs();