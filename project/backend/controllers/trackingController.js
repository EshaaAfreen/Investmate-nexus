import { Utilization, Revenue, CashFlow, Receipt, BusinessDoc } from "../models/Tracking.js";
import { Idea } from "../models/Idea.js";
import { Notification } from "../models/Notification.js";
import { Investment } from "../models/Investment.js";
import path from "path";
import fs from "fs";

// Helper to normalize paths
const normalizePath = (p) => p.replace(/\\/g, "/");

// Helper: Notify Investors
const notifyInvestors = async (businessId, message) => {
    // Find all investors for this business
    const investments = await Investment.find({ idea: businessId });
    const notifications = investments.map(inv => ({
        userId: inv.investor,
        type: 'upload',
        message: message,
        relatedId: businessId,
    }));
    if (notifications.length > 0) {
        await Notification.insertMany(notifications);
    }
};

// 1. UTILIZATION
export const addUtilization = async (req, res) => {
    try {
        const { id } = req.params; // businessId
        const { category, amount, description } = req.body;

        const utilization = await Utilization.create({
            businessId: id,
            category,
            amount,
            description
        });

        await notifyInvestors(id, `New utilization entry added: ${category} - $${amount}`);

        res.status(201).json({ success: true, data: utilization });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getUtilization = async (req, res) => {
    try {
        const data = await Utilization.find({ businessId: req.params.id }).sort({ date: -1 });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. REVENUE
export const addRevenue = async (req, res) => {
    try {
        const { id } = req.params;
        const { month, revenue, expenses } = req.body;
        const netProfit = revenue - expenses;

        const report = await Revenue.create({
            businessId: id,
            month,
            revenue,
            expenses,
            netProfit
        });

        await notifyInvestors(id, `Monthly revenue report added for ${month}`);

        res.status(201).json({ success: true, data: report });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getRevenue = async (req, res) => {
    try {
        const data = await Revenue.find({ businessId: req.params.id }).sort({ createdAt: 1 }); // Sort by creation to show timeline? Or need precise date sorting
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 3. CASH FLOW
export const addCashFlow = async (req, res) => {
    try {
        const { id } = req.params;
        const { month, cashIn, cashOut } = req.body;
        const netCash = cashIn - cashOut;

        const report = await CashFlow.create({
            businessId: id,
            month,
            cashIn,
            cashOut,
            netCash
        });

        await notifyInvestors(id, `Cash flow data added for ${month}`);

        res.status(201).json({ success: true, data: report });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getCashFlow = async (req, res) => {
    try {
        const data = await CashFlow.find({ businessId: req.params.id }).sort({ createdAt: 1 });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 4. DOCS (Business Registration etc)
export const uploadBusinessDoc = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;

        if (!req.file) {
            res.status(400).json({ success: false, message: "No file uploaded" });
            return;
        }

        const doc = await BusinessDoc.create({
            businessId: id,
            type,
            data: req.file.buffer,
            contentType: req.file.mimetype,
            filename: req.file.originalname,
            verified: false
        });

        await notifyInvestors(id, `New business document uploaded: ${type}`);

        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getTrackingFile = async (req, res) => {
    try {
        const { docId } = req.params;
        const doc = await BusinessDoc.findById(docId);
        if (!doc || !doc.data) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }
        res.set("Content-Type", doc.contentType);
        res.set("Content-Disposition", `inline; filename="${doc.filename}"`);
        res.send(doc.data);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const verifyDocument = async (req, res) => {
    try {
        const { docId } = req.params;
        const doc = await BusinessDoc.findById(docId);
        if (!doc) return res.status(404).json({ success: false, message: "Document not found" });

        doc.verified = true;
        await doc.save();

        res.json({ success: true, message: "Document verified", data: doc });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getBusinessDocs = async (req, res) => {
    try {
        const data = await BusinessDoc.find({ businessId: req.params.id });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// 5. RECEIPTS
export const uploadReceipt = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, amount } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const receipt = await Receipt.create({
            businessId: id,
            category,
            amount,
            data: req.file.buffer,
            contentType: req.file.mimetype,
            filename: req.file.originalname
        });

        await notifyInvestors(id, `New receipt uploaded for ${category}`);

        res.status(201).json({ success: true, data: receipt });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getReceiptFile = async (req, res) => {
    try {
        const { receiptId } = req.params;
        const receipt = await Receipt.findById(receiptId);
        if (!receipt || !receipt.data) {
            return res.status(404).json({ success: false, message: "Receipt not found" });
        }
        res.set("Content-Type", receipt.contentType);
        res.set("Content-Disposition", `inline; filename="${receipt.filename}"`);
        res.send(receipt.data);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getReceipts = async (req, res) => {
    try {
        const data = await Receipt.find({ businessId: req.params.id }).sort({ date: -1 });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// Helper to sort "Month Year" strings
const sortMonthlyStats = (stats) => {
    const monthMap = {
        "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "June": 5, "Jun": 5,
        "July": 6, "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
    };

    return stats.sort((a, b) => {
        const [monthA, yearA] = a.month.split(" ");
        const [monthB, yearB] = b.month.split(" ");

        if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
        return monthMap[monthA] - monthMap[monthB];
    });
};

// 6. DASHBOARD AGGREGATED STATS
export const getInvestorPortfolioStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Find all active investments by this investor
        const investments = await Investment.find({ investor: userId, status: 'active' });

        if (!investments.length) {
            return res.json({ success: true, data: [] });
        }

        const businessIds = investments.map(inv => inv.idea);

        // 2. Fetch all revenue reports for these businesses
        const revenues = await Revenue.find({
            businessId: { $in: businessIds }
        });

        // 3. Aggregate net profit by month
        const aggregation = {};

        revenues.forEach(rev => {
            if (!aggregation[rev.month]) {
                aggregation[rev.month] = 0;
            }
            aggregation[rev.month] += rev.netProfit || 0;
        });

        // Convert to array
        let result = Object.keys(aggregation).map(month => ({
            month,
            netProfit: aggregation[month]
        }));

        // Chronological Sorting
        result = sortMonthlyStats(result);

        res.json({ success: true, data: result });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 7. ENTREPRENEUR DASHBOARD STATS
export const getEntrepreneurStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Find all ideas owned by this entrepreneur
        const ideas = await Idea.find({ userId: userId }); // Fixed from Idea.find({ entrepreneur: userId }) to Idea.find({ userId: userId }) based on Idea.js model

        if (!ideas.length) {
            return res.json({ success: true, data: [] });
        }

        const businessIds = ideas.map(i => i._id);

        // 2. Fetch all revenue reports for these businesses
        const revenues = await Revenue.find({
            businessId: { $in: businessIds }
        });

        // 3. Aggregate net profit by month
        const aggregation = {};

        revenues.forEach(rev => {
            if (!aggregation[rev.month]) {
                aggregation[rev.month] = 0;
            }
            aggregation[rev.month] += rev.netProfit || 0;
        });

        // Convert to array
        let result = Object.keys(aggregation).map(month => ({
            month,
            netProfit: aggregation[month]
        }));

        // Chronological Sorting
        result = sortMonthlyStats(result);

        res.json({ success: true, data: result });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
