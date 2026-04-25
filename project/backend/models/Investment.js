

// models/Investment.js
import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema({
  investor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  idea: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: true },
  amount: { type: Number, required: true }, // optional, can track invested amount
   status: {
    type: String,
    enum: ["active", "withdrawn"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
});

export const Investment = mongoose.model("Investment", InvestmentSchema);
