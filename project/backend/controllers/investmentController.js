// controllers/investmentController.js
import { Investment } from "../models/Investment.js";
import { Idea } from "../models/Idea.js";

export const investInIdea = async (req, res) => {
  try {
    const investorId = req.user._id; // Updated to _id for consistency
    const ideaId = req.params.ideaId;
    const amount = Number(req.body.amount); // Ensure numeric

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid investment amount" });
    }

    // Check if idea exists
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // 🔒 BLOCK SELF-INVESTMENT
    if (idea.userId.toString() === investorId.toString()) {
      return res.status(403).json({
        message: "You cannot invest in your own idea",
      });
    }

    // Check if investment already exists
    let investment = await Investment.findOne({
      investor: investorId,
      idea: ideaId,
    });

    if (investment) {
      // ✅ TOP UP EXISTING INVESTMENT
      investment.amount += amount;
      investment.status = "active"; // Ensure it's active if it was withdrawn? 
      // Actually usually withdrawn sets amount 0, but if they invest again, we just add or reset.
      await investment.save();
    } else {
      // Create new investment
      investment = await Investment.create({
        investor: investorId,
        idea: ideaId,
        amount,
      });
    }

    res.status(201).json({
      success: true,
      message: "Investment successful",
      investment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyInvestments = async (req, res) => {
  try {
    const investorId = req.user._id;

    const investments = await Investment.find({ investor: investorId })
      .populate("idea", "title description status")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: investments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update investment amount
export const updateInvestment = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  if (!amount || isNaN(amount)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid amount" });
  }

  try {
    const investment = await Investment.findById(id);

    if (!investment) {
      return res
        .status(404)
        .json({ success: false, message: "Investment not found" });
    }

    // Check ownership
    if (investment.investor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized" });
    }

    investment.amount = amount;
    await investment.save();

    res.json({ success: true, data: investment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// Withdraw investment
export const withdrawInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    if (investment.investor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (investment.status === "withdrawn") {
      return res.status(400).json({ message: "Already withdrawn" });
    }

    // 🔒 Simulate refund here (later Stripe refund)
    investment.status = "withdrawn";
    investment.amount = 0;

    await investment.save();

    res.json({ success: true, message: "Investment withdrawn successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
