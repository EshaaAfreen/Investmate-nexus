import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    filename: { type: String },
    data: { type: Buffer },
    contentType: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false } // IMPORTANT 👉 prevent auto _id for subdocs
);

const IdeaSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    market: String,
    problem: String,
    solution: String,
    status: {
      type: String,
      enum: ["pending", "validated", "revision", "rejected"],
      default: "pending",
    },

    // 👉 PERFECT WAY
    files: {
      ideaLicense: { type: FileSchema, default: null },
      businessPlan: { type: FileSchema, default: null },
      marketResearch: { type: FileSchema, default: null },
      financials: { type: FileSchema, default: null },
    },


    feedback: [{ type: String }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Idea = mongoose.model("Idea", IdeaSchema);
export default Idea;
