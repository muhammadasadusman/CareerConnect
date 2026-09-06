
const Company = require("../models/company");

// ==========================
// Create Company
// ==========================
const createCompany = async (req, res) => {
  try {
    const {
      name,
      logo,
      description,
      location,
      website,
      industry,
    } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        message: "Company name and location are required",
      });
    }

    // Check if recruiter already has a company
    const existingCompany = await Company.findOne({
      recruiter: req.user.id,
    });

    if (existingCompany) {
      return res.status(400).json({
        message: "You already have a company profile",
        company: existingCompany,
      });
    }

    // ==========================
    // Company Logo Path
    // ==========================
    const companyName = name.toLowerCase();

    let companyLogo = logo || "";

    if (companyName.includes("google")) {
      companyLogo = "/uploads/logos/google.png";
    } else if (companyName.includes("microsoft")) {
      companyLogo = "/uploads/logos/microsoft.png";
    } else if (companyName.includes("airhub")) {
      companyLogo = "/uploads/logos/airhub.png";
    } else if (companyName.includes("netflix")) {
      companyLogo = "/uploads/logos/netflix.png";
    } else if (companyName.includes("twilio")) {
      companyLogo = "/uploads/logos/twilio.png";
    } else if (
      companyName.includes("fiverr") ||
      companyName.includes("fiver")
    ) {
      companyLogo = "/uploads/logos/fiver.png";
    } else if (companyName.includes("careerconnect")) {
  companyLogo = "/uploads/logos/careerconnect.png";
}

    // Create company
    const company = await Company.create({
      name,
      logo: companyLogo,
      description: description || "",
      location,
      website: website || "",
      industry: industry || "",
      recruiter: req.user.id,
    });

    res.status(201).json({
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    console.error("Create Company Error:", error);

    res.status(500).json({
      message: "Failed to create company",
      error: error.message,
    });
  }
};

// ==========================
// Get All Companies
// ==========================
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error("Get Companies Error:", error);

    res.status(500).json({
      message: "Failed to fetch companies",
      error: error.message,
    });
  }
};

// ==========================
// Get My Company
// ==========================
const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({
      recruiter: req.user.id,
    }).populate("recruiter", "name email");

    if (!company) {
      return res.status(404).json({
        message: "Company profile not found",
      });
    }

    res.status(200).json({
      company,
    });
  } catch (error) {
    console.error("Get My Company Error:", error);

    res.status(500).json({
      message: "Failed to fetch your company profile",
      error: error.message,
    });
  }
};

// ==========================
// Get Single Company
// ==========================
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate("recruiter", "name email");

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error("Get Company Error:", error);

    res.status(500).json({
      message: "Failed to fetch company",
      error: error.message,
    });
  }
};

// ==========================
// Update Company
// ==========================
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    if (company.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only update your own company",
      });
    }

    const {
      name,
      logo,
      description,
      location,
      website,
      industry,
    } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        message: "Company name and location are required",
      });
    }

    // ==========================
    // Company Logo Path
    // ==========================
    const companyName = name.toLowerCase();

    let companyLogo = logo || "";
if (companyName.includes("google")) {
  companyLogo = "/uploads/logos/google.png";
} else if (companyName.includes("microsoft")) {
  companyLogo = "/uploads/logos/microsoft.png";
} else if (companyName.includes("airhub")) {
  companyLogo = "/uploads/logos/airhub.png";
} else if (companyName.includes("netflix")) {
  companyLogo = "/uploads/logos/netflix.png";
} else if (companyName.includes("twilio")) {
  companyLogo = "/uploads/logos/twilio.png";
} else if (
  companyName.includes("fiverr") ||
  companyName.includes("fiver")
) {
  companyLogo = "/uploads/logos/fiver.png";
} else if (companyName.includes("careerconnect")) {
  companyLogo = "/uploads/logos/careerconnect.png";
}

    company.name = name;
    company.logo = companyLogo;
    company.description = description || "";
    company.location = location;
    company.website = website || "";
    company.industry = industry || "";

    const updatedCompany = await company.save();

    res.status(200).json({
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Update Company Error:", error);

    res.status(500).json({
      message: "Failed to update company",
      error: error.message,
    });
  }
};


// ==========================
// Delete Company
// ==========================
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // ==========================
    // ADMIN
    // Admin can delete ANY company
    // ==========================
    if (req.user.role === "admin") {
      await Company.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        message: "Company deleted successfully by admin",
      });
    }

    // ==========================
    // RECRUITER
    // Recruiter can delete ONLY their own company
    // ==========================
    if (req.user.role === "recruiter") {
      if (
        !company.recruiter ||
        company.recruiter.toString() !== req.user.id.toString()
      ) {
        return res.status(403).json({
          message: "You can only delete your own company",
        });
      }

      await Company.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        message: "Company deleted successfully",
      });
    }

    // ==========================
    // CANDIDATE / OTHER USERS
    // ==========================
    return res.status(403).json({
      message: "You are not authorized to delete companies",
    });
  } catch (error) {
    console.error("Delete Company Error:", error);

    res.status(500).json({
      message: "Failed to delete company",
      error: error.message,
    });
  }
};


// ==========================
// Export
// ==========================
module.exports = {
  createCompany,
  getCompanies,
  getMyCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
};

