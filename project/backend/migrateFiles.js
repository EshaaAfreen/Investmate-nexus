import mongoose from "mongoose";
import dotenv from "dotenv";
import { Idea } from "./models/Idea.js"; // adjust path if needed

dotenv.config(); // load .env

mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME, // or your DB name
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("MongoDB connected");

  try {
    const ideas = await Idea.find();

    for (const idea of ideas) {
      // Only migrate if files is an array
      if (Array.isArray(idea.files)) {
        const filesObj = {
          businessPlan: null,
          marketResearch: null,
          financials: null,
        };

        idea.files.forEach((f) => {
          const name = f.filename.toLowerCase();
          if (name.includes("business")) filesObj.businessPlan = f;
          else if (name.includes("market")) filesObj.marketResearch = f;
          else if (name.includes("financial")) filesObj.financials = f;
        });

        idea.files = filesObj;
        await idea.save();
        console.log(`Migrated idea ${idea._id}`);
      }
    }

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
