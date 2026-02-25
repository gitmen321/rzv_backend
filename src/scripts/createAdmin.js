const User = require('../models/User');
const connectDB = require('../config/db');
require("dotenv").config();

async function createAdmin() {

    try {
        await connectDB();

        const existingAdmin = await User.findOne({ role: "admin" });

        if (existingAdmin) {
            process.exit();
        }

        const admin = await User.create({
            name: "Founder Admin",
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: "admin",
            isEmailVerified: true,
            isActive: true
        });

        process.exit();

    } catch (error) {
        console.error("Admin creation failed error:", error);
        process.exit(1);
    }
}

createAdmin();
