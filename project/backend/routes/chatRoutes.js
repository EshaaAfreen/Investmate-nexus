import express from 'express';
import { getChatHistory, getContacts } from '../controllers/chatController.js';

const router = express.Router();

router.get('/history/:userId/:otherUserId', getChatHistory);
router.get('/contacts/:userId', getContacts);

export default router;
