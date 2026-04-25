import express from "express";
import { getIdeaInternal } from "../controllers/internalIdeaController.js";
import { internalTokenCheck } from "../middleware/internalToken.js";

const router = express.Router();

// Internal route protected by token
router.get("/internal/:id", internalTokenCheck, getIdeaInternal);

export default router;
