import Idea from "../models/Idea.js";

// Only internal access, no JWT required
export const getIdeaInternal = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ success: false, message: "Idea not found" });
    }
    res.json({ success: true, data: idea });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
