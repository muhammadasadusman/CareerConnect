const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const connectDatabase = require("./config/database");
const User = require("./models/userModel");

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDatabase();

    const existingAdmin = await User.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      console.log("Admin already exists ❗");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin12345", 10);

    const admin = await User.create({
      name: "CareerConnect Admin",
      email: "admin@careerconnect.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully ✅");
    console.log("Email:", admin.email);

    process.exit(0);
  } catch (error) {
    console.log("Failed to create admin ❌");
    console.log(error.message);
    process.exit(1);
  }
};

createAdmin();





