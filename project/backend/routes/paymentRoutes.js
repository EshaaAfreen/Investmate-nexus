// routes/paymentRoutes.js
import express from "express";
import { createPaymentIntent } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/payments/create-payment-intent
router.post("/create-payment-intent", protect, createPaymentIntent);

export default router;
