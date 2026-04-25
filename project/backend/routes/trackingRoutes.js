import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import {
    addUtilization,
    getUtilization,
    addRevenue,
    getRevenue,
    addCashFlow,
    getCashFlow,
    uploadBusinessDoc,
    getBusinessDocs,
    verifyDocument,
    uploadReceipt,
    getReceipts,
    getInvestorPortfolioStats,
    getEntrepreneurStats,
    getTrackingFile,
    getReceiptFile
} from "../controllers/trackingController.js";

const router = express.Router();

// Multer config (Memory storage for DB saving)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// All routes protected
router.use(protect);

// Dashboard Stats (Aggregated)
router.get("/investor-stats", getInvestorPortfolioStats);
router.get("/entrepreneur-stats", getEntrepreneurStats);

// Utilization
router.post("/:id/utilization", addUtilization);
router.get("/:id/utilization", getUtilization);

// Revenue
router.post("/:id/revenue", addRevenue);
router.get("/:id/revenue", getRevenue);

// Cash Flow
router.post("/:id/cashflow", addCashFlow);
router.get("/:id/cashflow", getCashFlow);

// Business Docs
router.post("/:id/docs", upload.single("file"), uploadBusinessDoc);
router.get("/:id/docs", getBusinessDocs);
router.get("/docs/:docId/file", getTrackingFile);
// Admin Verification Route
router.patch("/docs/:docId/verify", verifyDocument);

// Receipts
router.post("/:id/receipts", upload.single("file"), uploadReceipt);
router.get("/:id/receipts", getReceipts);
router.get("/receipts/:receiptId/file", getReceiptFile);

export default router;
