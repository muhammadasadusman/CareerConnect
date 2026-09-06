require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDatabase = require("./config/database");
const User = require("./models/userModel");

const resetAdmin = async () => {
  try {
    await connectDatabase();

    const hashedPassword = await bcrypt.hash("Admin@12345", 10);

    const admin = await User.findOneAndUpdate(
      { email: "admin@careerconnect.com" },
      { password: hashedPassword },
      { new: true }
    );

    if (!admin) {
      console.log("Admin user not found ❌");
      process.exit(1);
    }

    console.log("Admin password updated successfully ✅");
    console.log("Email:", admin.email);
    console.log("Password: Admin@12345");

    process.exit(0);
  } catch (error) {
    console.error("Reset password error:", error);
    process.exit(1);
  }
};

resetAdmin();