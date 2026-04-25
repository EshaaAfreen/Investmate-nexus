import { Idea } from "../models/Idea.js";
import { Investment } from "../models/Investment.js";
import { promises as fsPromises } from "fs";
import path from "path";
import fs from "fs";
// Utility for fixing Windows backslash paths
const normalizePath = (p) => p.replace(/\\/g, "/");


// ───────────── USER CONTROLLERS ─────────────

// Submit a new idea
export const submitIdea = async (req, res) => {
  const { title, description, market, problem, solution, feedback } = req.body;

  if (!title || !description || !market || !problem || !solution) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Idea license document is mandatory",
    });
  }


  try {
    const idea = await Idea.create({
      title,
      description,
      market,
      problem,
      solution,
      userId: req.user._id,
      feedback: feedback || [],
      files: {
        ideaLicense: {
          filename: req.file.originalname,
          data: req.file.buffer,
          contentType: req.file.mimetype,
          uploadedAt: new Date(),
        },
        businessPlan: null,
        marketResearch: null,
        financials: null,
      },

    });

    res.status(201).json({ success: true, data: idea });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get ideas by logged in user
export const getIdeasByUser = async (req, res) => {
  try {
    const ideas = await Idea.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: ideas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get idea by ID
export const getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ success: false, message: "Idea not found" });

    res.json({ success: true, data: idea });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all ideas
export const getAllIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });
    res.json({ success: true, data: ideas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Recommended ideas for investors
// Recommended ideas for investors (Content-Based Filtering)
export const getRecommendedIdeas = async (req, res) => {
  try {
    const investorId = req.user._id;

    if (!investorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 1. Fetch Investor's Past Investments to build Profile
    const pastInvestments = await Investment.find({ investor: investorId }).populate("idea");

    // 2. Build Preference Map (Count frequency of each Market)
    const marketPreferences = {};
    const investedIdeaIds = [];

    pastInvestments.forEach(inv => {
      if (inv.idea) {
        investedIdeaIds.push(inv.idea._id.toString());
        const market = inv.idea.market || "General";
        marketPreferences[market] = (marketPreferences[market] || 0) + 1;
      }
    });

    // 3. Fetch Candidates (Validated ideas, not owned by user, not already invested)
    const candidates = await Idea.find({
      status: "validated",
      userId: { $ne: investorId },
      _id: { $nin: investedIdeaIds }, // Exclude already invested
    });

    // 4. Score Candidates
    const scoredCandidates = candidates.map(idea => {
      const market = idea.market || "General";
      const marketScore = (marketPreferences[market] || 0) * 10; // 10 points per matching past investment

      // Recency Bonus: New ideas get a small boost logic (e.g., uploaded within last 7 days = +5 points)
      const daysSinceCreation = (new Date() - new Date(idea.createdAt)) / (1000 * 60 * 60 * 24);
      const recencyBonus = daysSinceCreation < 7 ? 5 : 0;

      const totalScore = marketScore + recencyBonus;

      return {
        ...idea.toObject(),
        score: totalScore,
        matchReason: marketScore > 0 ? `Matches your interest in ${market}` : "New and Trending"
      };
    });

    // 5. Sort by Score (Descending)
    scoredCandidates.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      count: scoredCandidates.length,
      data: scoredCandidates.slice(0, 10), // Return top 10
    });
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Update Idea
export const updateIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ success: false, message: "Idea not found" });

    if (idea.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    const { title, description, market, problem, solution } = req.body;

    idea.title = title || idea.title;
    idea.description = description || idea.description;
    idea.market = market || idea.market;
    idea.problem = problem || idea.problem;
    idea.solution = solution || idea.solution;

    await idea.save();

    res.json({ success: true, message: "Idea updated successfully", data: idea });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete idea
export const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ success: false, message: "Idea not found" });

    if (idea.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not allowed" });

    // Block deletion if it has any investments
    const investmentExists = await Investment.findOne({ idea: idea._id });
    if (investmentExists) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete, investor already invested",
      });
    }

    await Idea.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Idea deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ───────────── DOCUMENT UPLOAD CONTROLLER ─────────────

// Upload idea documents (with lazy migration)
export const uploadIdeaDocs = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea)
      return res.status(404).json({ success: false, message: "Idea not found" });

    if (idea.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not allowed" });

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const normalizePath = (filePath) => filePath.replace(/\\/g, "/");

    // -------- FIX: Proper lazy migration --------
    if (!idea.files || Array.isArray(idea.files)) {
      idea.files = {
        businessPlan: undefined,
        marketResearch: undefined,
        financials: undefined,
      };
    }
    // -------------------------------------------

    const processFile = (fileKey) => {
      if (req.files[fileKey]) {
        const file = req.files[fileKey][0];
        if (file.size === 0) {
          fs.unlink(file.path, () => { }); // Delete empty file
          return false;
        }
        idea.files[fileKey] = {
          filename: file.originalname,
          data: file.buffer,
          contentType: file.mimetype,
          uploadedAt: new Date(),
        };
        return true;
      }
      return false;
    };

    const bpUploaded = processFile('businessPlan');
    const mrUploaded = processFile('marketResearch');
    const fiUploaded = processFile('financials');

    if (!bpUploaded && !mrUploaded && !fiUploaded) {
      return res.status(400).json({ success: false, message: "uploaded files cannot be empty" });
    }

    await idea.save();

    res.json({
      success: true,
      message: "Documents uploaded successfully",
      data: idea,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// Serve specific idea documents from DB
export const getIdeaFile = async (req, res) => {
  try {
    const { id, fileType } = req.params;
    const idea = await Idea.findById(id);

    if (!idea) {
      return res.status(404).json({ success: false, message: "Idea not found" });
    }

    const file = idea.files[fileType];
    if (!file || !file.data) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    res.set("Content-Type", file.contentType);
    // Optionally set content-disposition to preserve filename on download
    res.set("Content-Disposition", `inline; filename="${file.filename}"`);
    res.send(file.data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Serve specific idea documents for ML model (Internal)
export const getIdeaFileInternal = async (req, res) => {
  try {
    const { id, fileType } = req.params;
    console.log(`[ML Internal] Request for "${fileType}" on Idea: ${id}`);

    const idea = await Idea.findById(id);
    if (!idea) {
      console.log(`[ML Internal] ERROR: Idea ${id} NOT FOUND in database`);
      return res.status(404).json({ success: false, message: "Idea not found" });
    }

    const file = idea.files[fileType];
    if (!file || !file.data) {
      console.log(`[ML Internal] ERROR: File "${fileType}" or binary data missing for Idea ${id}`);
      console.log("Available files:", idea.files ? Object.keys(idea.files) : "none");
      return res.status(404).json({ success: false, message: "File not found" });
    }

    console.log(`[ML Internal] SUCCESS: Serving "${fileType}" (${file.contentType}) for Idea ${id}`);
    res.set("Content-Type", file.contentType);
    res.send(file.data);
  } catch (err) {
    console.error(`[ML Internal] FATAL ERROR: ${err.message}`);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete specific idea documents
export const deleteIdeaFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const { types } = req.body; // e.g., ["businessPlan", "marketResearch"]

    const idea = await Idea.findById(id);
    if (!idea) {
      return res.status(404).json({ success: false, message: "Idea not found" });
    }

    if (idea.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    for (const type of types) {
      // Remove reference in MongoDB by setting it to null
      idea.files[type] = null;
    }

    idea.markModified("files");
    await idea.save();

    return res.json({
      success: true,
      message: "Files deleted successfully",
      data: idea,
    });
  } catch (err) {
    console.error("Error in deleteIdeaFiles:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
// ───────────── ADMIN CONTROLLERS ─────────────

// Admin: Get all ideas
export const adminGetAllIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: ideas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Update idea status
export const updateIdeaStatus = async (req, res) => {
  const { status } = req.body;

  if (!["validated", "revision", "pending", "rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const updated = await Idea.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Idea not found" });
    }

    res.json({
      success: true,
      message: "Status updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
