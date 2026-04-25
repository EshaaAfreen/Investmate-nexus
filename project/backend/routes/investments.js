// routes/investments.js
import express from "express";
import { investInIdea ,getMyInvestments,updateInvestment, withdrawInvestment} from "../controllers/investmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/my-investments", protect, getMyInvestments);
// POST /api/investments/:ideaId
router.post("/:ideaId", protect, investInIdea);

router.put("/:id", protect, updateInvestment);
router.delete("/:id/withdraw", protect, withdrawInvestment);

export default router;
