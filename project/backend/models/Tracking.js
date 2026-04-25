import mongoose from "mongoose";

// 1. Utilization Config (Categories) & Data
const UtilizationSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: true },
    investmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Investment" }, // Optional linking
    category: { type: String, required: true }, // e.g., Marketing, Equipment
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: String
});

// 2. Monthly Revenue Report
const RevenueSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: true },
    month: { type: String, required: true }, // e.g., "Jan 2024"
    revenue: { type: Number, required: true },
    expenses: { type: Number, required: true },
    netProfit: { type: Number }, // Calculated
    createdAt: { type: Date, default: Date.now }
});

// 3. Cash Flow Statement
const CashFlowSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: true },
    month: { type: String, required: true },
    cashIn: { type: Number, required: true },
    cashOut: { type: Number, required: true },
    netCash: { type: Number }, // Calculated
    createdAt: { type: Date, default: Date.now }
});

// 4. Receipts & Invoices
const ReceiptSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: true },
    category: { type: String, required: true },
    amount: { type: Number },
    data: { type: Buffer },
    contentType: { type: String },
    filename: { type: String },
    date: { type: Date, default: Date.now }
});

// 5. Business Documentation (Registration, etc.)
const BusinessDocSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: true },
    type: { type: String, required: true }, // 'registration', 'license', 'ntn'
    data: { type: Buffer },
    contentType: { type: String },
    filename: { type: String },
    verified: { type: Boolean, default: false }, // Admin/System verification
    uploadedAt: { type: Date, default: Date.now }
});

// Export all models
export const Utilization = mongoose.model("Utilization", UtilizationSchema);
export const Revenue = mongoose.model("Revenue", RevenueSchema);
export const CashFlow = mongoose.model("CashFlow", CashFlowSchema);
export const Receipt = mongoose.model("Receipt", ReceiptSchema);
export const BusinessDoc = mongoose.model("BusinessDoc", BusinessDocSchema);
