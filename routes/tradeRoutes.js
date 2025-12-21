import express from 'express';
import { executeTrade } from '../controllers/tradeController.js'; // MUST BE SINGULAR

const router = express.Router();
router.post('/execute', executeTrade);

export default router;