import express from "express";
import multer from "multer";
import {
  submitIdea,
  getIdeasByUser,
  getIdeaById,
  getRecommendedIdeas,
  getAllIdeas,
  adminGetAllIdeas,
  updateIdeaStatus,
  deleteIdea,
  updateIdea,
  uploadIdeaDocs,
  deleteIdeaFiles,
  getIdeaFile,
  getIdeaFileInternal,
} from "../controllers/ideaController.js";
import { protect, verifyAdmin } from "../middleware/authMiddleware.js";
import { getIdeaInternal } from "../controllers/internalIdeaController.js";
import { internalTokenCheck } from "../middleware/internalToken.js";

const router = express.Router();

// Multer config for uploads (Using memory storage to save to DB)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ───────────── INTERNAL ML ROUTES (HIGHER PRIORITY) ─────────────
router.get("/internal/:id", internalTokenCheck, getIdeaInternal);
router.get("/internal/:id/files/:fileType", internalTokenCheck, getIdeaFileInternal);

// ───────────── ADMIN ROUTES ─────────────
router.get("/admin/ideas", protect, verifyAdmin, adminGetAllIdeas);
router.put("/admin/idea/:id/status", protect, verifyAdmin, updateIdeaStatus);

// ───────────── USER ROUTES ─────────────
router.post("/submit", protect, upload.single('ideaLicense'), submitIdea);

router.get("/my-ideas", protect, getIdeasByUser);
router.get("/all-ideas", protect, getAllIdeas);
router.get("/recommendations", protect, getRecommendedIdeas);
router.get("/:id", protect, getIdeaById);
router.put("/update/:id", protect, updateIdea);
router.delete("/delete/:id", protect, deleteIdea);
router.put("/:id/delete-files", protect, deleteIdeaFiles);

// Route to serve files from DB
router.get("/:id/files/:fileType", protect, getIdeaFile);

// Upload documents for an idea
router.post(
  "/:id/upload-docs",
  protect,
  upload.fields([
    { name: "businessPlan", maxCount: 1 },
    { name: "marketResearch", maxCount: 1 },
    { name: "financials", maxCount: 1 },
  ]),
  uploadIdeaDocs
);

export default router;
