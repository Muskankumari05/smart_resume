import express from 'express';
import { getRankedCandidates } from '../controllers/ranking.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:jobId', protect, getRankedCandidates);

export default router;
