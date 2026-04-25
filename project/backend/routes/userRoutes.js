import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addRole, switchRole, getUserById } from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", protect, getUserById);
router.post("/add-role", protect, addRole);
router.post("/switch-role", protect, switchRole);

export default router;
