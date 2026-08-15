import express from 'express';
import { generateInterview, getInterviewByCandidate } from '../controllers/interview.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/generate', protect, generateInterview);
router.get('/:candidateId', protect, getInterviewByCandidate);

export default router;
