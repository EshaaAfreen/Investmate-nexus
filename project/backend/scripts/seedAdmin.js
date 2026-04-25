import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = "admin@admin.com";
        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            console.log("Admin user already exists.");
            process.exit(0);
        }

        const adminUser = new User({
            name: "Admin User",
            email: adminEmail,
            password: "admin@123", // Will be hashed by pre-save hook
            roles: ["admin"],
            activeRole: "admin",
        });

        await adminUser.save();
        console.log("Admin user created successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin user:", error);
        process.exit(1);
    }
};

seedAdmin();
